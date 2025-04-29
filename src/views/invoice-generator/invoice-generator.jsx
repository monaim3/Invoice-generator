import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ReactComponent as IconDownload } from "bootstrap-icons/icons/download.svg";
import { ReactComponent as IconFilePdf } from "bootstrap-icons/icons/file-pdf.svg";
import { ReactComponent as IconPrinter } from "bootstrap-icons/icons/printer.svg";
import { ReactComponent as IconThreeDotsVertical } from "bootstrap-icons/icons/three-dots-vertical.svg";
import { ReactComponent as IconX } from "bootstrap-icons/icons/x-lg.svg";
import pdfExport from "../../common/pdfExport";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import toyota from './../../res/images/New folder (2)/Toyota.jpg';
import mistubishi from './../../res/images/New folder (2)/mitsubishi.jpeg';
import nishan from './../../res/images/New folder (2)/Nishan.jpeg';
import honda from './../../res/images/New folder (2)/HondaLast.jpg';
import mazda from './../../res/images/New folder (2)/mazda.jpeg';
import greatwall from './../../res/images/New folder (2)/Great wall.jpg';
import hyndai from './../../res/images/invoiceBrandLogo/hyundai.jpeg';
import mercedis from './../../res/images/New folder (2)/mercedes.jpg';

import lexus from './../../res/images/New folder (2)/Lexus.jpg';
import bmw from './../../res/images/New folder (2)/BMW.jpeg';

import milon from './../../res/images/New folder (2)/mm.jpg';
import visa from './../../res/images/New folder (2)/visa.jpeg';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const InvoiceGenerator = () => {
  //const [discountValue, setDiscountValue] = useState(getSubtotal(items));

  const location = useLocation();
  const uuidGen = () =>
    Math.random().toString(36).substring(2) + Date.now().toString(36);

  const randomNumber = (min, max) =>
    Math.floor(Math.random() * (max - min) + min);

  const [defaultSettings] = useState(
    localStorage.getItem("defaultSettings")
      ? JSON.parse(localStorage.getItem("defaultSettings"))
      : {
        imgSrc: "",
        defaultCurrency: "TK",
        taxation: "GST",
        taxationPer: 0,
        discounts: 0,
        shipping: 0,
        invoiceNo: 1,
        invoiceFrom: "",
        terms: "",
        footNote: "",
        defaultTemplate: "temp1",
      }
  );

  const blankItem = {
    title: "",
    quantity: 0,
    rate: 0,
    taxationPer: defaultSettings?.taxationPer ?? 0,
    amount: 0,
    unit: "pcs",
    due:0,
    paymentType: "cash",
  };
  const blanFooterLogos = {
    logo1: "",
    logo2: "",
    logo3: "",
    logo4: "",
  };
  const brandFooterLogos = {
    logo1: toyota,
    logo2: mistubishi,
    logo3: nishan,
    logo4: honda,
    logo5: mazda,
    logo6: greatwall,
    logo7: hyndai,
    logo8: mercedis,
    logo9: lexus,
    logo10: bmw,
    milon: milon,
    visa: visa,
  };
  const [invoices, setInvoices] = useState(
    localStorage.getItem("invoices")
      ? JSON.parse(localStorage.getItem("invoices"))
      : []
  );
  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}
  
  const [invoice, setInvoice] = useState({
    imgSrc: defaultSettings?.imgSrc ?? "",
    uuid: uuidGen(),
    title: defaultSettings?.invoiceNo ?? "Vehicle No:",
    //invoiceNo: randomNumber(1, 999999),
    invoiceNo:defaultSettings?.invoiceNo ?? 1,
    invoiceDate: formatDate(new Date()),
    dueDate:
      defaultSettings?.autoDueDate === true && defaultSettings?.autoDueDays > 0
        ? new Date(
          new Date().setDate(
            new Date().getDate() + defaultSettings?.autoDueDays
          )
        ).toLocaleDateString("en-CA")
        : "",
    invoiceFrom: defaultSettings?.invoiceFrom ?? "",
    invoiceTo: "",
    items: [blankItem],
    discounts: defaultSettings?.discounts ?? 0,
    shipping: defaultSettings?.shipping ?? 0,
    terms: defaultSettings?.terms ?? "",
    footNote: defaultSettings?.footNote ?? "",
    currency: defaultSettings?.defaultCurrency ?? "TK",
    taxation: defaultSettings?.taxation ?? "GST",
    footerLogos: blanFooterLogos,
    brandLogo: brandFooterLogos,
  });

  const dueTotal=(items)=>
    items
    .reduce((sum, item) => Number(sum) + Number(item.due), 0)
    .toFixed(2);

  
  const getSubtotal = (items) =>
    items
      .reduce((sum, item) => Number(sum) + Number(item.amount), 0)
      .toFixed(2);

  const getTotal = (items, discounts, shipping) =>
    (
      getSubtotal(items) -
      Number(discounts || 0) +
      Number(shipping || 0)
    ).toFixed(2);

  const getAmount = (item) => {
    const { quantity, rate, taxationPer } = item;
    let totalAmount = quantity * rate;
    let taxAmount = totalAmount * (taxationPer ?? 0 / 100);
    let grossAmount = (Number(totalAmount) + Number(taxAmount)).toFixed(2);
    item.amount = grossAmount;
    return grossAmount;
    
  };

  // useEffect(()=>{
 
  // },[gros])
  const handleHrefClick = (e, uuid) => {
    e.stopPropagation();
    e.preventDefault();
    const target = e.target;
    if (
      (target === null || target === void 0 ? void 0 : target.tagName) === "A"
    ) {
      setInvoice(invoices.find((s, i) => s.uuid === uuid));
    }
    return true;
  };
  
  const handleUserInput = (e) => {

    if(e.target.name=="invoiceDate"){
      const date=e.target.value.split("-").reverse().join("-")

      setInvoice((prev) => ({
        ...prev,
        [e.target.name]: date,
  
     
      }));
    
    }else{
      setInvoice((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
  
      }));
    }
  };


  const handleChange = (i) => (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.map((item, index) =>
        i === index ? { ...item, [name]: value } : { ...item }
      ),
    }));
  };

  const addItem = () =>
    setInvoice((prev) => ({ ...prev, items: [...prev.items, blankItem] }));

  const handleRemoveItem = (idx) => () => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((s, i) => idx !== i),
    }));
  };

  const handleRemoveInvoice = (idx) => {
    if (window.confirm("Are you sure you wish to delete this invoice?")) {
      setInvoices((item) =>
        item.filter((s, i) => {
          // 👇️ remove object that has index equal to idx
          return idx !== i;
        })
      );
    }
  };

  const handleRemoveImage = () => {
    setInvoice((prev) => ({
      ...prev,
      imgSrc: "",
    }));
  };

  const handleNewInvoice = () => {
    setInvoice((prev) => ({
      ...prev,
      imgSrc: defaultSettings?.imgSrc ?? "",
      uuid: uuidGen(),
      title: defaultSettings?.invoiceNo ?? "Vehicle No:",
      // invoiceNo: randomNumber(1, 999999),
      invoiceNo: invoices.length>0 ? invoices[0].invoiceNo+1 :1,
      invoiceDate:  formatDate(new Date()),
      dueDate:
        defaultSettings?.autoDueDate === true &&
          defaultSettings?.autoDueDays > 0
          ? new Date(
            new Date().setDate(
              new Date().getDate() + defaultSettings?.autoDueDays
            )
          ).toLocaleDateString("en-CA")
          : "",
      invoiceFrom: defaultSettings?.invoiceFrom ?? "",
      invoiceTo: "",
      items: [blankItem],
      discounts: defaultSettings?.discounts ?? 0,
      shipping: defaultSettings?.shipping ?? 0,
      terms: defaultSettings?.terms ?? "",
      footNote: defaultSettings?.footNote ?? "",
      currency: defaultSettings?.defaultCurrency ?? "",
      taxation: defaultSettings?.taxation ?? "GST",
    }));
  };
  console.log(invoice.invoiceNo)
  const saveInvoice = () => {
    

    let currentUuid = invoice.uuid;
    let findObject = invoices.find((s, i) => s.uuid === currentUuid);
    if (findObject) {
      setInvoices(
        invoices.map((item) =>
          item.uuid === currentUuid
            ? {
              ...item,
              imgSrc: invoice.imgSrc,
              title: invoice.title,
              invoiceNo: invoice.invoiceNo,
              invoiceDate: invoice.invoiceDate,
              dueDate: invoice.dueDate,
              invoiceFrom: invoice.invoiceFrom,
              invoiceTo: invoice.invoiceTo,
              items: invoice.items,
              discounts: invoice.discounts,
              shipping: invoice.shipping,
              terms: invoice.terms,
              footNote: invoice.footNote,
              currency: invoice.currency,
              taxation: invoice.taxation,
              footerLogos: invoice.footerLogos,
              brandFooterLogos: invoice.brandLogo,
            }
            : { ...item }
        )
      );
    } else {
      setInvoices((item) => [invoice, ...item]);
    }
    // localStorage.setItem("defaultSettings",JSON.stringify({...defaultSettings,invoiceNo:defaultSettings.invoiceNo+1}))
  };
    useEffect(()=>{
      const invLength=invoices.length;

      if(invLength>0){
        const updateInv=invoices[0].invoiceNo+1
        setInvoice({...invoice,invoiceNo:updateInv})
      }
 
  },[])
  
  const onImageChange = (e) => {
    // this / e.target is current target element.
    // stops the browser from redirecting.
    e.stopPropagation();
    e.preventDefault();
    var files = e.target.files;
    var fileCount = files.length;
    var i;
    if (fileCount > 0) {
      for (i = 0; i < fileCount; i = i + 1) {
        var file = files[i];
        // var name = file.name;
        // var size = this.bytesToSize(file.size);
        var reader = new FileReader();
        reader.onload = function (e) {
          setInvoice((prev) => ({
            ...prev,
            imgSrc: e.target.result,
          }));
        };
        reader.readAsDataURL(file);
      }
    }
    return false;
  };

  //logo change
  const onLogoChange = (e) => {
    // this / e.target is current target element.
    // stops the browser from redirecting.
    
    e.stopPropagation();
    e.preventDefault();
    var files = e.target.files;
    var fileCount = files.length;
    var i;
    if (fileCount > 0) {
      for (i = 0; i < fileCount; i = i + 1) {
        var file = files[i];
        // var name = file.name;
        // var size = this.bytesToSize(file.size);
        var reader = new FileReader();
        reader.onload = function (event) {
          setInvoice((prev) => ({
            ...prev,
            footerLogos: { ...prev.footerLogos, [e.target.name]: event.target.result },
          }));
        };
        reader.readAsDataURL(file);
      }
    }
    return false;
  };
  const downloadInvoice = (obj) => {
  
    pdfExport.downloadInvoice(obj);
  };

  const openInvoice = (obj) => {
 
    pdfExport.openInvoice(obj);
  };

  const printInvoice = (obj) => {
    pdfExport.printInvoice(obj);
  };

  useEffect(() => {
    if (location?.state?.uuid) {
      setInvoice(invoices.find((s, i) => s.uuid === location?.state?.uuid));
    }
  }, [location?.state?.uuid, invoices]);

  useEffect(() => {
    localStorage.setItem("invoices", JSON.stringify(invoices));
    
  }, [invoices]);

  
  const {
    imgSrc,
    uuid,
    title,
    invoiceNo,
    invoiceDate,
    dueDate,
    invoiceFrom,
    invoiceTo,
    items,
    discounts,
    shipping,
    terms,
    footNote,
    currency,
    taxation,
  } = invoice;
 useEffect(()=>{
    setInvoice((prev) => ({
      ...prev,
      discounts:getSubtotal(items)
    }));
 },[items])
  return (
    <div className="bg-light-view">
      <div className="row mt-3">
        <div className="col-lg-10">
          <div className="papers mb-3">
            <div className="row">
              <div className="col-md-6">
                <div className="row">
                  <div className="col-md-6">
                    {imgSrc !== "" && (
                      <div className="position-relative">
                        <img
                          src={imgSrc}
                          className="mr-3 rounded preview-image"
                          alt=""
                        />
                        <button
                          type="button"
                          title="Remove logo"
                          onClick={handleRemoveImage}
                          className="btn btn-dark btn-sm preview-image-remove"
                        >
                          &times;
                        </button>
                      </div>
                    )}
                    {imgSrc === "" && (
                      <div className="files color">
                        <input
                          type="file"
                          className="form-control form-control-sm"
                          accept="image/x-png,image/jpg,image/jpeg"
                          id="customFile"
                          onChange={onImageChange}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="row">
                  <div className="col-md-12">
                    <div className="input-group">
                      <input
                        type="text"
                        name="title"
                        maxLength="20"
                        placeholder="Invoice"
                        className="form-control"
                        value={title}
                        onChange={handleUserInput}
                      />
                      <div className="input-group-text">Invoice No</div>
                      <div className="input-group-text">#</div>
                      <input
                        type="number"
                        min="1"
                        className="form-control"
                        name="invoiceNo"
                        value={invoiceNo}
                        onChange={handleUserInput}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12 mt-2">
                    <div className="input-group input-group-sm">
                      <div className="input-group-text">Invoice Date:</div>
                      <input
                        type="date"
                        className="form-control"
                        name="invoiceDate"
                        value={invoiceDate.split("-").reverse().join("-")
                      }
                        onChange={(event) => handleUserInput(event)}
                      />
                      {/* <div className="input-group-text">Due Date:</div>
                      <input
                        type="date"
                        className="form-control"
                        name="dueDate"
                        value={dueDate}
                        onChange={(event) => handleUserInput(event)}
                      /> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mt-3 mb-3">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="invoiceFrom">Invoice from</label>
                  <textarea
                    className="form-control"
                    id="invoiceFrom"
                    name="invoiceFrom"
                    rows="3"
                    required
                    placeholder="Who is this invoice from? (required)"
                    value={invoiceFrom}
                    onChange={(event) => handleUserInput(event)}
                  ></textarea>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="invoiceTo">Invoice to</label>
                  <textarea
                    className="form-control"
                    id="invoiceTo"
                    name="invoiceTo"
                    rows="3"
                    required
                    placeholder="Who is this invoice to? (required)"
                    value={invoiceTo}
                    onChange={(event) => handleUserInput(event)}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <div className="d-sm-block d-md-block d-lg-none d-xl-none d-xxl-none">
                  {items.map((item, index) => (
                    <div key={index} className="card mb-3">
                      <div className="card-body">
                        <div className="card-title fw-bold">
                          Item #{index + 1}
                          <button
                            type="button"
                            title="Remove"
                            onClick={handleRemoveItem(index)}
                            className="btn btn-danger btn-sm float-end"
                          >
                            <IconX />
                          </button>
                        </div>
                        <div className="row">
                          <div className="col-12">
                            <div className="form-floating mb-3">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Description of service or product..."
                                name="title"
                                value={item.title}
                                onChange={handleChange(index)}
                                id={`floatingInputDesc${index}`}
                              />
                              <label htmlFor={`floatingInputDesc${index}`}>
                                Description of service or product...
                              </label>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="form-floating mb-3">
                              <input
                                type="number"
                                min="0"
                                className="form-control form-control-sm"
                                placeholder="Quantity"
                                name="quantity"
                                value={item.quantity}
                                onChange={handleChange(index)}
                                id={`floatingInputQty${index}`}
                              />
                              <label htmlFor={`floatingInputQty${index}`}>
                                Quantity
                              </label>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="form-floating mb-3">
                              <input
                                type="number"
                                min="0"
                                className="form-control form-control-sm"
                                placeholder="Rate"
                                name="rate"
                                value={item.rate}
                                onChange={handleChange(index)}
                                id={`floatingInputRat${index}`}
                              />
                              <label htmlFor={`floatingInputRat${index}`}>
                                Rate ({currency || "TK"})
                              </label>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="input-group input-group-sm">
                              <div className="form-floating">
                                <input
                                  type="number"
                                  min="0"
                                  className="form-control"
                                  name="taxationPer"
                                  value={item.taxationPer ?? 0}
                                  onChange={handleChange(index)}
                                  id={`floatingInputPer${index}`}
                                />
                                <label htmlFor={`floatingInputPer${index}`}>
                                  {taxation || "GST"}
                                </label>
                              </div>
                              <div className="input-group-text pe-1 ps-1">
                                %
                              </div>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="form-floating">
                              <input
                                type="text"
                                className="form-control"
                                disabled
                                readOnly
                                id={`floatingInputAmo${index}`}
                                value={getAmount(item)}
                              />
                              <label htmlFor={`floatingInputAmo${index}`}>
                                Amount ({currency || "TK"})
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="btn btn-primary btn-sm mb-3"
                    onClick={(event) => addItem(event)}
                  >
                    &#43; Add Item
                  </button>
                </div>

                <div className="table-responsive d-none d-sm-none d-md-none d-lg-block d-xl-block d-xxl-block">
                  <table className="table table-striped table-hover table-sm">
                    <caption>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={(event) => addItem(event)}
                      >
                        &#43; Add Item
                      </button>
                    </caption>
                    <thead>
                      <tr className="d-flex">
                        <th className="col-md-1" scope="col">
                          #
                        </th>
                        <th className="col-md-3" scope="col">
                          Item
                        </th>
                        <th className="col-md-1" scope="col">
                          Quantity
                        </th>
                        <th className="col-md-1" scope="col">
                          Unit
                        </th>
                        {/* <th className="col-md-1" scope="col">
                          Due
                        </th> */}
                        {/* <th className="col-md-1" scope="col">
                          Payment
                        </th> */}
                        <th className="col-md-2" scope="col">
                          Rate ({currency || "TK"})
                        </th>
                        {/* <th className="col-md-1" scope="col">
                          {taxation || "GST"}
                        </th> */}
                        <th className="col-md-4" scope="col">
                          Amount ({currency || "TK"})
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={index} className="d-flex">
                          <th className="col-md-1" scope="row">
                            {index + 1}
                            <button
                              type="button"
                              title="Remove"
                              onClick={handleRemoveItem(index)}
                              className="btn btn-danger btn-sm float-end"
                            >
                              <IconX />
                            </button>
                          </th>
                          <td className="col-md-3">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Description of service or product..."
                              name="title"
                              value={item.title}
                              onChange={handleChange(index)}
                            />
                          </td>
                          <td className="col-md-1">
                            <input
                              type="number"
                              min="0"
                              className="form-control form-control-sm"
                              placeholder="Quantity"
                              name="quantity"
                              value={item.quantity}
                              onChange={handleChange(index)}
                            />
                          </td>
                          <td className="col-md-1">

                            <select className="form-control form-control-sm" name="unit" value={item.unit}
                              onChange={handleChange(index)}>
                              <option value={"pcs"}>
                                Pcs
                              </option>
                              <option value={"set"}>
                                Set
                              </option>
                            </select>
                          </td>
                          {/* <td className="col-md-1">
                            <input
                              type="number"
                              min="0"
                              className="form-control form-control-sm"
                              placeholder="Due"
                              name="due"
                              value={item.due}
                              onChange={handleChange(index)}
                            />
                          </td> */}
                          {/* <td className="col-md-1">
                            <select
                              className="form-control form-control-sm"
                              name="paymentType"
                              value={item.paymentType}
                              onChange={handleChange(index)}
                            >
                              <option value={"payment"}>Cash</option>
                              <option value={"due"}>Due</option>
                            </select>
                          </td> */}

                          <td className="col-md-1">
                            <input
                              type="number"
                              min="0"
                              className="form-control form-control-sm"
                              placeholder="Rate"
                              name="rate"
                              value={item.rate}
                              onChange={handleChange(index)}
                            />
                          </td>
                          {/* <td className="col-md-2">
                            <div className="input-group input-group-sm">
                              <input
                                type="number"
                                min="0"
                                className="form-control"
                                name="taxationPer"
                                value={item.taxationPer ?? 0}
                                onChange={handleChange(index)}
                              />
                              <div className="input-group-text pe-1 ps-1">
                                %
                              </div>
                            </div>
                          </td> */}
                          <td className="col-md-4 text-end">{getAmount(item)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-lg-7 d-none d-sm-none d-md-none d-lg-block d-xl-block d-xxl-block">
                <div className="form-group mb-3">
                  <label htmlFor="terms">Terms & Conditions</label>
                  <textarea
                    className="form-control"
                    id="terms"
                    name="terms"
                    rows="2"
                    required
                    defaultValue="We don't return advanced payment"
                    // placeholder="Terms and conditions - late fees, payment methods, delivery schedule"
                    value={terms}
                    onChange={(event) => handleUserInput(event)}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="footNote">Foot Note</label>
                  <textarea
                    className="form-control"
                    id="footNote"
                    name="footNote"
                    rows="2"
                    required
                    placeholder="Thank you for your business"
                    value={footNote}
                    onChange={(event) => handleUserInput(event)}
                  ></textarea>
                </div>
              </div>
              <div className="col-lg-5">
              {/* <div className="row mb-2">
                  <label className="col-sm-3 col-form-label fw-semibold">
                    Due Total
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      className="form-control"
                      disabled
                      readOnly
                      value={dueTotal(items)}
                    />
                  </div>
                </div> */}


                <div className="row mb-2">
                  <label className="col-sm-3 col-form-label fw-semibold">
                    Subtotal
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      className="form-control"
                      disabled
                      readOnly
                      value={getSubtotal(items)}
                    />
                  </div>
                </div>
                <div className="row mb-2">
                  <label
                    htmlFor="discounts"
                    className="col-sm-3 col-form-label"
                  >
                    Cash
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      //id="discounts"
                      min="0"
                      className="form-control"
                      name="discounts"
                      value={invoice.discounts}
                      //defaultValue={getSubtotal(items)}
                       //value={invoices.discounts || 0}
    
                      onChange={(event) => handleUserInput(event)}
                    />
                  </div>
                </div>
                
                <div className="row mb-2">
                  <label htmlFor="shipping" className="col-sm-3 col-form-label">
                    Shipping
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="number"
                      id="shipping"
                      min="0"
                      className="form-control"
                      name="shipping"
                      value={shipping || 0}
                      onChange={(event) => handleUserInput(event)}
                    />
                  </div>
                </div>
                <div className="row mb-2">
                  <label className="col-sm-3 col-form-label fw-bold">
                    Due ({invoice.currency || "TK"})
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      className="form-control"
                      disabled
                      readOnly
                      value={getTotal(items, discounts, shipping)}
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-7 d-sm-block d-md-block d-lg-none d-xl-none d-xxl-none">
                <div className="form-group mb-3">
                  <label htmlFor="terms">Terms & Conditions</label>
                  <textarea
                    className="form-control"
                    id="terms"
                    name="terms"
                    rows="2"
                    defaultValue="We don't return advanced payment"
                    required
                    value={terms}
                    onChange={(event) => handleUserInput(event)}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="footNote">Foot Note</label>
                  <textarea
                    className="form-control"
                    id="footNote"
                    name="footNote"
                    rows="2"
                    required
                    placeholder="Thank you for your business"
                    value={footNote}
                    onChange={(event) => handleUserInput(event)}
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="row ">

              {/* <div className="col-3 files color">
               <input
                          type="file"
                          className="form-control form-control-sm"
                          accept="image/x-png,image/jpg,image/jpeg"
                          id="customFile"
                          onChange={onImageChange}
                        />
               </div> */}

              {/* <div className="col-3 files color">
               <input style={{'borderRadius':'15px'}} type="file" name="logo1" className="form-control form-control-sm" accept="image/x-png,image/jpg,image/jpeg" id="customFile"  placeholder="" onChange={onLogoChange}/>
               </div> */}
              {/* <div className="col-3 files color">
               <input style={{'borderRadius':'15px'}} type="file" multiple="multiple" className="form-control form-control-sm" accept="image/x-png,image/jpg,image/jpeg" id="customFile"  placeholder="" onChange={onLogoChange}/>
               </div> */}
              {/* <div className="col-3 files color">
               <input type="file" name="logo2" className="form-control form-control-sm" accept="image/x-png,image/jpg,image/jpeg" id="customFile"  placeholder="" onChange={onLogoChange}/>
               </div>
               <div className="col-3 files color">
               <input type="file" name="logo3" className="form-control form-control-sm" accept="image/x-png,image/jpg,image/jpeg" id="customFile"  placeholder="" onChange={onLogoChange}/>
               </div>
               <div className="col-3 files color">
               <input type="file" name="logo4" className="form-control form-control-sm" accept="image/x-png,image/jpg,image/jpeg" id="customFile"  placeholder="" onChange={onLogoChange}/>
               </div> */}

            </div>
          </div>
        </div>
        <div className="col-lg-2">
          <div className="d-grid gap-2 mb-2">
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={saveInvoice}
            >
              Save Invoice
            </button>
          </div>
          <div className="d-grid gap-2 mb-2">
            <div
              className="btn-group btn-block mb-3"
              role="group"
              aria-label="Basic example"
            >
              <button
                type="button"
                className="btn btn-outline-primary"
                title="Download"
                onClick={() => downloadInvoice(invoice)}
              >
                <IconDownload />
              </button>
              <button
                type="button"
                className="btn btn-outline-primary"
                title="Open PDF File"
                onClick={() => openInvoice(invoice)}
              >
                <IconFilePdf />
              </button>
              <button
                type="button"
                className="btn btn-outline-primary"
                title="Print"
                onClick={() => printInvoice(invoice)}
              >
                <IconPrinter />
              </button>
            </div>
          </div>
          <div className="mb-3">
            <h6>
              My Invoice{" "}
              <span className="badge bg-primary text-white">
                {invoices.length}
              </span>
              <button
                type="button"
                title="New Invoice"
                onClick={handleNewInvoice}
                className="btn btn-outline-primary btn-sm float-end pe-1 ps-1 p-0"
              >
                New
              </button>
            </h6>
            <hr></hr>
            <div >
              <div className="list-group ">
                {invoices.map((item, index) => (
                  <a
                    key={item.uuid + index}
                    href="#!"
                    className={`list-group-item list-group-item-action ${item.uuid === uuid ? "active" : ""
                      }`}
                    onClick={(event) => handleHrefClick(event, item.uuid)}
                  >
                    {item.invoiceNo}{" "}
                    <div className="dropdown float-end">
                      <button
                        className={`btn btn-sm ${item.uuid === uuid
                            ? "btn-outline-light"
                            : "btn-secondary"
                          }`}
                        type="button"
                        id="dropdownMenuButton"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <IconThreeDotsVertical />
                      </button>
                      <div
                        className="dropdown-menu dropdown-menu-right"
                        aria-labelledby="dropdownMenuButton"
                      >
                        <button
                          type="button"
                          title="Download Invoice"
                          onClick={() => downloadInvoice(item)}
                          className="dropdown-item"
                        >
                          Download
                        </button>
                        <button
                          type="button"
                          title="Open PDF Invoice"
                          onClick={() => openInvoice(item)}
                          className="dropdown-item"
                        >
                          Open PDF
                        </button>
                        <button
                          type="button"
                          title="Print Invoice"
                          onClick={() => printInvoice(item)}
                          className="dropdown-item"
                        >
                          Print
                        </button>
                        <div className="dropdown-divider"></div>
                        <button
                          type="button"
                          title="Delete Invoice"
                          onClick={() => handleRemoveInvoice(index)}
                          className="dropdown-item bg-danger text-light"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
