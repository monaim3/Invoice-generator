import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.min.css";
import ActionRenderer from "./actionRenderer.jsx";
import pdfExport from "../../common/pdfExport";

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
      //filter: "agTextColumnFilter",
      // enable floating filters by default
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
      // specify we want to use the date filter
      filter: "agDateColumnFilter",
      // add extra parameters for the date filter
      filterParams: {
        // provide comparator function
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          // In the example application, dates are stored as dd/mm/yyyy
          // We create a Date object for comparison against the filter date
          const dateParts = cellValue.split("-");
          const year = Number(dateParts[0]);
          const month = Number(dateParts[1]) - 1;
          const day = Number(dateParts[2]);
          const cellDate = new Date(year, month, day);
          // Now that both parameters are Date objects, we can compare
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
    <div>
      <div className="row mt-3">
        <div className="col-md-12">
          <h5>Invoices</h5>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div
            style={{ height: "600px", width: "100%" }}
            className={
              theme === "dark" ? `ag-theme-alpine-dark` : `ag-theme-alpine`
            }
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
    </div>
  );
};

export default InvoiceList;
