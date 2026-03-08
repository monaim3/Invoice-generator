import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.min.css";
import ActionRenderer from "./actionRenderer.jsx";
import pdfExport from "../../common/pdfExport";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./invoicelist.css";



const InvoiceList = () => {
  const history = useNavigate();
  const importRef = useRef(null);

  const [rowData, setRowData] = useState(
    localStorage.getItem("invoices")
      ? JSON.parse(localStorage.getItem("invoices"))
      : []
  );
  useEffect(() => {
    localStorage.setItem("invoices", JSON.stringify(rowData));
  }, [rowData]);

  const exportCSV = () => {
    if (rowData.length === 0) {
      toast.info("No invoices to export.");
      return;
    }
    const headers = ["Invoice No", "Invoice Date", "Due Date", "Currency", "Invoice To", "Payment Status", "Subtotal", "Cash", "Shipping", "Due"];
    const rows = rowData.map((inv) => {
      const subtotal = (inv.items || []).reduce((s, i) => s + Number(i.amount || 0), 0).toFixed(2);
      const due = (Number(subtotal) - Number(inv.discounts || 0) + Number(inv.shipping || 0)).toFixed(2);
      return [
        inv.invoiceNo,
        inv.invoiceDate,
        inv.dueDate || "",
        inv.currency || "",
        `"${(inv.invoiceTo || "").replace(/"/g, '""')}"`,
        inv.paymentStatus || "unpaid",
        subtotal,
        inv.discounts || 0,
        inv.shipping || 0,
        due,
      ].join(",");
    });
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "invoices.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported successfully!");
  };

  const exportJSON = () => {
    if (rowData.length === 0) {
      toast.info("No invoices to backup.");
      return;
    }
    const blob = new Blob([JSON.stringify(rowData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "invoices-backup.json";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("JSON backup downloaded!");
  };

  const importJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!Array.isArray(data)) throw new Error("Invalid format");
        setRowData(data);
        toast.success(`${data.length} invoice(s) restored successfully!`);
      } catch {
        toast.error("Invalid backup file. Please use a valid JSON backup.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const methodFromParent = (props, action) => {
    if (action === "edit") {
      history("/", { replace: false, state: { uuid: props.data.uuid } });
    } else {
      const item = rowData.find((s, i) => s.uuid === props.data.uuid);
      if (action === "downloadPDF") {
        pdfExport.downloadInvoice(item);
      } else if (action === "openPDF") {
        pdfExport.openInvoice(item);
      } else if (action === "printPDF") {
        pdfExport.printInvoice(item);
      } else if (action === "deleteInvoice") {
        if (window.confirm("Are you sure you wish to delete this invoice?")) {
          setRowData((item) =>
            item.filter((s, i) => {
              return s.uuid !== props.data.uuid;
            })
          );
        }
      }
    }
  };

  const getPreferredTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    if (
      storedTheme === "auto" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return storedTheme;
  };

  const [theme] = useState(getPreferredTheme());
  const [quickSearch, setQuickSearch] = useState("");

  const filteredData = quickSearch.trim()
    ? rowData.filter(
        (inv) =>
          String(inv.invoiceNo).includes(quickSearch) ||
          (inv.invoiceTo || "").toLowerCase().includes(quickSearch.toLowerCase()) ||
          (inv.paymentStatus || "").toLowerCase().includes(quickSearch.toLowerCase())
      )
    : rowData;

  let state = {
    context: { componentParent: methodFromParent },
    defaultColDef: {
      flex: 1,
      sortable: true,
      filter: true,
      resizable: true,
      floatingFilter: true,
    },
    columnDefs: [
      {
        headerName: "Invoice No",
        field: "invoiceNo",
        maxWidth: 140,
      },
      {
        headerName: "Invoice Date",
        field: "invoiceDate",
        filter: "agDateColumnFilter",
        type: ["dateColumn"],
        maxWidth: 200,
      },
      {
        headerName: "Due Date",
        field: "dueDate",
        filter: "agDateColumnFilter",
        type: ["dateColumn"],
        maxWidth: 200,
      },
      {
        headerName: "Currency",
        field: "currency",
        maxWidth: 130,
      },
      {
        headerName: "Invoice To",
        field: "invoiceTo",
      },
      {
        headerName: "Status",
        field: "paymentStatus",
        maxWidth: 130,
        cellRenderer: (params) => {
          const status = params.value || "unpaid";
          const colorMap = { paid: "success", partial: "warning", unpaid: "danger" };
          return `<span class="badge bg-${colorMap[status] || "secondary"}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>`;
        },
      },
      {
        headerName: "Action",
        field: "invoiceNo",
        cellRenderer: ActionRenderer,
        colId: "params",
        maxWidth: 270,
        filter: false,
      },
    ],
  };

  const columnTypes = {
    dateColumn: {
      filter: "agDateColumnFilter",
      filterParams: {
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          const dateParts = cellValue.split("-");
          const year = Number(dateParts[0]);
          const month = Number(dateParts[1]) - 1;
          const day = Number(dateParts[2]);
          const cellDate = new Date(year, month, day);
          if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
            return 0;
          }
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          }
          if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }
        },
      },
    },
  };

  return (
    <div className="invoice-list-container">
      <ToastContainer autoClose={2500} />
      <div className="invoice-header">
        <div className="header-content">
          <h1 className="invoice-title">Invoices</h1>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <div className="invoice-count">
              <span className="count-badge">{rowData.length}</span>
              <span className="count-label">Total Invoices</span>
            </div>
            <button className="btn btn-sm btn-light" onClick={exportCSV} title="Export CSV">
              CSV Export
            </button>
            <button className="btn btn-sm btn-light" onClick={exportJSON} title="Backup JSON">
              Backup
            </button>
            <label className="btn btn-sm btn-light mb-0" title="Restore from JSON backup">
              Restore
              <input ref={importRef} type="file" accept=".json" hidden onChange={importJSON} />
            </label>
          </div>
        </div>
      </div>
      
      <div className="invoice-grid-wrapper">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Quick search by invoice no, customer name, or status..."
            value={quickSearch}
            onChange={(e) => setQuickSearch(e.target.value)}
          />
        </div>
        <div
          className={`invoice-grid ${
            theme === "dark" ? `ag-theme-alpine-dark` : `ag-theme-alpine`
          }`}
        >
          <AgGridReact
            rowSelection="single"
            context={state.context}
            columnDefs={state.columnDefs}
            rowData={filteredData}
            defaultColDef={state.defaultColDef}
            frameworkComponents={state.frameworkComponents}
            columnTypes={columnTypes}
          ></AgGridReact>
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;