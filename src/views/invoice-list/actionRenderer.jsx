import { ReactComponent as IconDownload } from "bootstrap-icons/icons/download.svg";
import { ReactComponent as IconFileTupePdf } from "bootstrap-icons/icons/filetype-pdf.svg";
import { ReactComponent as IconPrinter } from "bootstrap-icons/icons/printer.svg";
import { ReactComponent as IconTrash } from "bootstrap-icons/icons/trash.svg";

const ActionRenderer = (params) => {
  const invokeParentMethod = () => {
    params.context.componentParent(params, "edit");
  };

  const invokeParentMethodDownloadPDF = () => {
    params.context.componentParent(params, "downloadPDF");
  };

  const invokeParentMethodOpenPDF = () => {
    params.context.componentParent(params, "openPDF");
  };

  const invokeParentMethodPrintPDF = () => {
    params.context.componentParent(params, "printPDF");
  };

  const invokeParentMethodDeleteInvoice = () => {
    params.context.componentParent(params, "deleteInvoice");
  };
  return (
    <span>
      <button onClick={invokeParentMethod} className="btn btn-sm btn-outline-info me-2">
        Open
      </button>
      <button
        onClick={invokeParentMethodDownloadPDF}
        className="btn btn-sm btn-outline-primary me-2"
        title="Download PDF"
      >
        <IconDownload />
      </button>
      <button
        onClick={invokeParentMethodOpenPDF}
        className="btn btn-sm btn-outline-primary me-2"
        title="Open PDF"
      >
        <IconFileTupePdf />
      </button>
      <button
        onClick={invokeParentMethodPrintPDF}
        className="btn btn-sm btn-outline-primary me-2"
        title="Print PDF"
      >
        <IconPrinter />
      </button>
      <button
        onClick={invokeParentMethodDeleteInvoice}
        className="btn btn-sm btn-outline-danger"
        title="Delete Invoice"
      >
        <IconTrash />
      </button>
    </span>
  );
};

export default ActionRenderer;
