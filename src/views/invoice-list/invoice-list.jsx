import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.min.css";
import ActionRenderer from "./actionRenderer.jsx";
import pdfExport from "../../common/pdfExport";
import "./invoicelist.css"; // Import the enhanced CSS file



const InvoiceList = () => {
  const history = useNavigate();

  const [rowData, setRowData] = useState(
    localStorage.getItem("invoices")
      ? JSON.parse(localStorage.getItem("invoices"))
      : []
  );
  useEffect(() => {
    localStorage.setItem("invoices", JSON.stringify(rowData));
  }, [rowData]);

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
      <div className="invoice-header">
        <div className="header-content">
          <h1 className="invoice-title">Invoices</h1>
          <div className="invoice-count">
            <span className="count-badge">{rowData.length}</span>
            <span className="count-label">Total Invoices</span>
          </div>
        </div>
      </div>
      
      <div className="invoice-grid-wrapper">
        <div
          className={`invoice-grid ${
            theme === "dark" ? `ag-theme-alpine-dark` : `ag-theme-alpine`
          }`}
        >
          <AgGridReact
            rowSelection="single"
            context={state.context}
            columnDefs={state.columnDefs}
            rowData={rowData}
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