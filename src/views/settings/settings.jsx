import { useState, useEffect } from "react";
import { SketchPicker } from "react-color";
import temp1 from "../../res/images/invoice/Template 1.jpg";
import temp2 from "../../res/images/invoice/Template 2.jpg";
import temp3 from "../../res/images/invoice/Template 3.jpg";
import temp4 from "../../res/images/invoice/Template 4.jpg";
import temp5 from "../../res/images/invoice/Template 5.jpg";
import temp6 from "../../res/images/invoice/Template 6.jpg";

const Settings = () => {
  // PDF Setting (docDefinition)
  const [docDefinition] = useState(
    localStorage.getItem("docDefinition")
      ? JSON.parse(localStorage.getItem("docDefinition"))
      : {
          backgroundColor: "#0069D9",
          pageOrientation: "portrait",
          pageSize: "A4",
          watermark: {
            text: "",
            opacity: 0.3,
            bold: false,
            italics: false,
          },
          qrCodeActive: false,
          qrCode: {
            qr: "",
            foreground: "#000000",
            background: "#FFFFFF",
            eccLevel: "L",
            appendInvoiceNo: false,
          },
        }
  );
  const [backgroundColor, setBackgroundColor] = useState(
    docDefinition.backgroundColor
  );
  const [watermarkText, setWatermarkText] = useState(
    docDefinition.watermark.text
  );
  const [watermarkOpacity, setWatermarkOpacity] = useState(
    docDefinition.watermark.opacity
  );
  const [watermarkBold, setWatermarkBold] = useState(
    docDefinition.watermark.bold
  );
  const [watermarkItalics, setWatermarkItalics] = useState(
    docDefinition.watermark.italics
  );
  const [pageSize, setPageSize] = useState(docDefinition.pageSize);
  const [pageOrientation, setPageOrientation] = useState(
    docDefinition.pageOrientation
  );
  const [qrCodeActive, setQrCodeActive] = useState(
    docDefinition.qrCodeActive ?? false
  );
  const [qrCodeText, setQrCodeText] = useState(docDefinition.qrCode?.qr ?? "");
  const [qrCodeForeground, setQrCodeForeground] = useState(
    docDefinition.qrCode?.foreground ?? "#000000"
  );
  const [qrCodeBackground, setQrCodeBackground] = useState(
    docDefinition.qrCode?.background ?? "#FFFFFF"
  );
  const [qrCodeEccLevel, setQrCodeEccLevel] = useState(
    docDefinition.qrCode?.eccLevel ?? "L"
  );
  const [qrCodeAppendInvoiceNo, setQrCodeAppendInvoiceNo] = useState(
    docDefinition.qrCode?.appendInvoiceNo ?? false
  );
  // Default Settings (defaultSettings)
  const [defaultSettings, setDefaultSettings] = useState(
    localStorage.getItem("defaultSettings")
      ? JSON.parse(localStorage.getItem("defaultSettings"))
      : {
          imgSrc: "",
          defaultCurrency: "USD",
          taxation: "GST",
          taxationPer: 0,
          discounts: 0,
          shipping: 0,
          invoiceNo: "Invoice No:",
          autoDueDate: false,
          autoDueDays: 0,
          invoiceFrom: "",
          terms: "",
          footNote: "",
          defaultTemplate: "temp1",
        }
  );
  const [imgSrc, setImgSrc] = useState(defaultSettings.imgSrc);
  const [taxation, setTaxation] = useState(defaultSettings?.taxation ?? "GST");
  const [defaultCurrency, setDefaultCurrency] = useState(
    defaultSettings?.defaultCurrency
  );
  const [taxationPer, setTaxationPer] = useState(
    defaultSettings.taxationPer ?? 0
  );
  const [discounts, setDiscounts] = useState(defaultSettings?.discounts ?? 0);
  const [shipping, setShipping] = useState(defaultSettings?.shipping ?? 0);
  const [invoiceNo, setInvoiceNo] = useState(
    defaultSettings?.invoiceNo ?? "Invoice No:"
  );
  const [autoDueDate, setAutoDueDate] = useState(
    defaultSettings?.autoDueDate ?? false
  );
  const [autoDueDays, setAutoDueDays] = useState(
    defaultSettings?.autoDueDays ?? 0
  );

  const [invoiceFrom, setInvoiceFrom] = useState(defaultSettings.invoiceFrom);
  const [terms, setTerms] = useState(defaultSettings.terms);
  const [footNote, setFootNote] = useState(defaultSettings.footNote);

  // Template
  const [defaultTemplate, setDefaultTemplate] = useState(
    defaultSettings.defaultTemplate
  );

  const state = {
    pageSize: [
      "4A0",
      "2A0",
      "A0",
      "A1",
      "A2",
      "A3",
      "A4",
      "A5",
      "A6",
      "A7",
      "A8",
      "A9",
      "A10",
    ],
    pageOrientation: ["portrait", "landscape"],
    currency: [
      { code: "AFN", name: "Afghan Afghani" },
      { code: "ALL", name: "Albanian Lek" },
      { code: "DZD", name: "Algerian Dinar" },
      { code: "AOA", name: "Angolan Kwanza" },
      { code: "ARS", name: "Argentine Peso" },
      { code: "AMD", name: "Armenian Dram" },
      { code: "AWG", name: "Aruban Florin" },
      { code: "AUD", name: "Australian Dollar" },
      { code: "AZN", name: "Azerbaijani Manat" },
      { code: "BSD", name: "Bahamian Dollar" },
      { code: "BHD", name: "Bahraini Dinar" },
      { code: "BDT", name: "Bangladeshi Taka" },
      { code: "BBD", name: "Barbadian Dollar" },
      { code: "BYN", name: "Belarusian Ruble" },
      { code: "BZD", name: "Belize Dollar" },
      { code: "BMD", name: "Bermudan Dollar" },
      { code: "BTN", name: "Bhutanese Ngultrum" },
      { code: "BTC", name: "Bitcoin" },
      { code: "BOB", name: "Bolivian Boliviano" },
      { code: "BAM", name: "Bosnia-Herzegovina Convertible Mark" },
      { code: "BWP", name: "Botswanan Pula" },
      { code: "BRL", name: "Brazilian Real" },
      { code: "GBP", name: "British Pound Sterling" },
      { code: "BND", name: "Brunei Dollar" },
      { code: "BGN", name: "Bulgarian Lev" },
      { code: "BIF", name: "Burundian Franc" },
      { code: "XOF", name: "CFA Franc BCEAO" },
      { code: "XAF", name: "CFA Franc BEAC" },
      { code: "XPF", name: "CFP Franc" },
      { code: "KHR", name: "Cambodian Riel" },
      { code: "CAD", name: "Canadian Dollar" },
      { code: "CVE", name: "Cape Verdean Escudo" },
      { code: "KYD", name: "Cayman Islands Dollar" },
      { code: "CLP", name: "Chilean Peso" },
      { code: "CLF", name: "Chilean Unit of Account (UF)" },
      { code: "CNY", name: "Chinese Yuan" },
      { code: "CNH", name: "Chinese Yuan (Offshore)" },
      { code: "COP", name: "Colombian Peso" },
      { code: "KMF", name: "Comorian Franc" },
      { code: "CDF", name: "Congolese Franc" },
      { code: "CRC", name: "Costa Rican Colón" },
      { code: "HRK", name: "Croatian Kuna" },
      { code: "CUC", name: "Cuban Convertible Peso" },
      { code: "CUP", name: "Cuban Peso" },
      { code: "CZK", name: "Czech Republic Koruna" },
      { code: "DKK", name: "Danish Krone" },
      { code: "DJF", name: "Djiboutian Franc" },
      { code: "DOP", name: "Dominican Peso" },
      { code: "XCD", name: "East Caribbean Dollar" },
      { code: "EGP", name: "Egyptian Pound" },
      { code: "ERN", name: "Eritrean Nakfa" },
      { code: "ETB", name: "Ethiopian Birr" },
      { code: "EUR", name: "Euro" },
      { code: "FKP", name: "Falkland Islands Pound" },
      { code: "FJD", name: "Fijian Dollar" },
      { code: "GMD", name: "Gambian Dalasi" },
      { code: "GEL", name: "Georgian Lari" },
      { code: "GHS", name: "Ghanaian Cedi" },
      { code: "GIP", name: "Gibraltar Pound" },
      { code: "XAU", name: "Gold Ounce" },
      { code: "GTQ", name: "Guatemalan Quetzal" },
      { code: "GGP", name: "Guernsey Pound" },
      { code: "GNF", name: "Guinean Franc" },
      { code: "GYD", name: "Guyanaese Dollar" },
      { code: "HTG", name: "Haitian Gourde" },
      { code: "HNL", name: "Honduran Lempira" },
      { code: "HKD", name: "Hong Kong Dollar" },
      { code: "HUF", name: "Hungarian Forint" },
      { code: "ISK", name: "Icelandic Króna" },
      { code: "INR", name: "Indian Rupee" },
      { code: "IDR", name: "Indonesian Rupiah" },
      { code: "IRR", name: "Iranian Rial" },
      { code: "IQD", name: "Iraqi Dinar" },
      { code: "ILS", name: "Israeli New Sheqel" },
      { code: "JMD", name: "Jamaican Dollar" },
      { code: "JPY", name: "Japanese Yen" },
      { code: "JEP", name: "Jersey Pound" },
      { code: "JOD", name: "Jordanian Dinar" },
      { code: "KZT", name: "Kazakhstani Tenge" },
      { code: "KES", name: "Kenyan Shilling" },
      { code: "KWD", name: "Kuwaiti Dinar" },
      { code: "KGS", name: "Kyrgystani Som" },
      { code: "LAK", name: "Laotian Kip" },
      { code: "LBP", name: "Lebanese Pound" },
      { code: "LSL", name: "Lesotho Loti" },
      { code: "LRD", name: "Liberian Dollar" },
      { code: "LYD", name: "Libyan Dinar" },
      { code: "MOP", name: "Macanese Pataca" },
      { code: "MKD", name: "Macedonian Denar" },
      { code: "MGA", name: "Malagasy Ariary" },
      { code: "MWK", name: "Malawian Kwacha" },
      { code: "MYR", name: "Malaysian Ringgit" },
      { code: "MVR", name: "Maldivian Rufiyaa" },
      { code: "IMP", name: "Manx pound" },
      { code: "MRU", name: "Mauritanian Ouguiya" },
      { code: "MRO", name: "Mauritanian Ouguiya (pre-2018)" },
      { code: "MUR", name: "Mauritian Rupee" },
      { code: "MXN", name: "Mexican Peso" },
      { code: "MDL", name: "Moldovan Leu" },
      { code: "MNT", name: "Mongolian Tugrik" },
      { code: "MAD", name: "Moroccan Dirham" },
      { code: "MZN", name: "Mozambican Metical" },
      { code: "MMK", name: "Myanma Kyat" },
      { code: "NAD", name: "Namibian Dollar" },
      { code: "NPR", name: "Nepalese Rupee" },
      { code: "ANG", name: "Netherlands Antillean Guilder" },
      { code: "TWD", name: "New Taiwan Dollar" },
      { code: "NZD", name: "New Zealand Dollar" },
      { code: "NIO", name: "Nicaraguan Córdoba" },
      { code: "NGN", name: "Nigerian Naira" },
      { code: "KPW", name: "North Korean Won" },
      { code: "NOK", name: "Norwegian Krone" },
      { code: "OMR", name: "Omani Rial" },
      { code: "PKR", name: "Pakistani Rupee" },
      { code: "XPD", name: "Palladium Ounce" },
      { code: "PAB", name: "Panamanian Balboa" },
      { code: "PGK", name: "Papua New Guinean Kina" },
      { code: "PYG", name: "Paraguayan Guarani" },
      { code: "PEN", name: "Peruvian Nuevo Sol" },
      { code: "PHP", name: "Philippine Peso" },
      { code: "XPT", name: "Platinum Ounce" },
      { code: "PLN", name: "Polish Zloty" },
      { code: "QAR", name: "Qatari Rial" },
      { code: "RON", name: "Romanian Leu" },
      { code: "RUB", name: "Russian Ruble" },
      { code: "RWF", name: "Rwandan Franc" },
      { code: "SHP", name: "Saint Helena Pound" },
      { code: "SVC", name: "Salvadoran Colón" },
      { code: "WST", name: "Samoan Tala" },
      { code: "SAR", name: "Saudi Riyal" },
      { code: "RSD", name: "Serbian Dinar" },
      { code: "SCR", name: "Seychellois Rupee" },
      { code: "SLL", name: "Sierra Leonean Leone" },
      { code: "XAG", name: "Silver Ounce" },
      { code: "SGD", name: "Singapore Dollar" },
      { code: "SBD", name: "Solomon Islands Dollar" },
      { code: "SOS", name: "Somali Shilling" },
      { code: "ZAR", name: "South African Rand" },
      { code: "KRW", name: "South Korean Won" },
      { code: "SSP", name: "South Sudanese Pound" },
      { code: "XDR", name: "Special Drawing Rights" },
      { code: "LKR", name: "Sri Lankan Rupee" },
      { code: "SDG", name: "Sudanese Pound" },
      { code: "SRD", name: "Surinamese Dollar" },
      { code: "SZL", name: "Swazi Lilangeni" },
      { code: "SEK", name: "Swedish Krona" },
      { code: "CHF", name: "Swiss Franc" },
      { code: "SYP", name: "Syrian Pound" },
      { code: "STN", name: "São Tomé and Príncipe Dobra" },
      { code: "STD", name: "São Tomé and Príncipe Dobra (pre-2018)" },
      { code: "TJS", name: "Tajikistani Somoni" },
      { code: "TZS", name: "Tanzanian Shilling" },
      { code: "THB", name: "Thai Baht" },
      { code: "TOP", name: "Tongan Pa'anga" },
      { code: "TTD", name: "Trinidad and Tobago Dollar" },
      { code: "TND", name: "Tunisian Dinar" },
      { code: "TRY", name: "Turkish Lira" },
      { code: "TMT", name: "Turkmenistani Manat" },
      { code: "UGX", name: "Ugandan Shilling" },
      { code: "UAH", name: "Ukrainian Hryvnia" },
      { code: "AED", name: "United Arab Emirates Dirham" },
      { code: "USD", name: "United States Dollar" },
      { code: "UYU", name: "Uruguayan Peso" },
      { code: "UZS", name: "Uzbekistan Som" },
      { code: "VUV", name: "Vanuatu Vatu" },
      { code: "VEF", name: "Venezuelan Bolívar Fuerte (Old)" },
      { code: "VES", name: "Venezuelan Bolívar Soberano" },
      { code: "VND", name: "Vietnamese Dong" },
      { code: "YER", name: "Yemeni Rial" },
      { code: "ZMW", name: "Zambian Kwacha" },
      { code: "ZWL", name: "Zimbabwean Dollar" },
    ],
    taxation: [
      { code: "VAT", name: "VAT" },
      { code: "SST", name: "SST" },
      { code: "TAX", name: "TAX" },
      { code: "GST", name: "GST" },
      { code: "PPN", name: "PPN" },
      { code: "HST", name: "HST" },
    ],
  };

  useEffect(() => {
    let docDefinitionTemp = localStorage.getItem("docDefinition")
      ? JSON.parse(localStorage.getItem("docDefinition"))
      : {
          backgroundColor: "#0069D9",
          pageOrientation: "portrait",
          pageSize: "A4",
          watermark: {
            text: "",
            opacity: 0.3,
            bold: false,
            italics: false,
          },
          qrCodeActive: false,
          qrCode: {
            qr: "",
            foreground: "#000000",
            background: "#FFFFFF",
            version: 1,
            eccLevel: "L",
          },
        };
    docDefinitionTemp.backgroundColor = backgroundColor;
    docDefinitionTemp.pageOrientation = pageOrientation;
    docDefinitionTemp.pageSize = pageSize;
    docDefinitionTemp.watermark.text = watermarkText;
    docDefinitionTemp.watermark.opacity = watermarkOpacity;
    docDefinitionTemp.watermark.bold = watermarkBold;
    docDefinitionTemp.watermark.italics = watermarkItalics;
    docDefinitionTemp.qrCodeActive = qrCodeActive;
    if (docDefinitionTemp.qrCode) {
      docDefinitionTemp.qrCode.qr = qrCodeText;
      docDefinitionTemp.qrCode.foreground = qrCodeForeground;
      docDefinitionTemp.qrCode.background = qrCodeBackground;
      docDefinitionTemp.qrCode.eccLevel = qrCodeEccLevel;
      docDefinitionTemp.qrCode.appendInvoiceNo = qrCodeAppendInvoiceNo;
    } else {
      docDefinitionTemp.qrCode = {
        qr: qrCodeText,
        foreground: qrCodeForeground,
        background: qrCodeBackground,
        eccLevel: qrCodeEccLevel,
        appendInvoiceNo: qrCodeAppendInvoiceNo,
      };
    }

    setLocalStorage("docDefinition", docDefinitionTemp);

    let defaultSettingsTemp = localStorage.getItem("defaultSettings")
      ? JSON.parse(localStorage.getItem("defaultSettings"))
      : {
          imgSrc: "",
          defaultCurrency: "USD",
          taxation: "GST",
          taxationPer: 0,
          discounts: 0,
          shipping: 0,
          invoiceNo: "Invoice No:",
          autoDueDate: false,
          autoDueDays: 0,
          invoiceFrom: "",
          terms: "",
          footNote: "",
          defaultTemplate: "temp1",
          
        };
    defaultSettingsTemp.imgSrc = imgSrc;
    defaultSettingsTemp.defaultCurrency = defaultCurrency;
    defaultSettingsTemp.taxation = taxation;
    defaultSettingsTemp.taxationPer = taxationPer;
    defaultSettingsTemp.discounts = discounts;
    defaultSettingsTemp.shipping = shipping;
    defaultSettingsTemp.invoiceNo = invoiceNo;
    defaultSettingsTemp.autoDueDate = autoDueDate;
    defaultSettingsTemp.autoDueDays = autoDueDays;
    defaultSettingsTemp.invoiceFrom = invoiceFrom;
    defaultSettingsTemp.terms = terms;
    defaultSettingsTemp.footNote = footNote;
    defaultSettingsTemp.defaultTemplate = defaultTemplate;
    setLocalStorage("defaultSettings", defaultSettingsTemp);
    setDefaultSettings((item) => ({
      ...item,
      taxation: taxation,
      autoDueDate: autoDueDate,
    }));
  }, [
    backgroundColor,
    defaultCurrency,
    defaultTemplate,
    discounts,
    footNote,
    taxationPer,
    imgSrc,
    invoiceFrom,
    invoiceNo,
    pageOrientation,
    pageSize,
    shipping,
    terms,
    watermarkBold,
    watermarkItalics,
    watermarkOpacity,
    watermarkText,
    taxation,
    autoDueDate,
    autoDueDays,
    qrCodeText,
    qrCodeForeground,
    qrCodeBackground,
    qrCodeEccLevel,
    qrCodeActive,
    qrCodeAppendInvoiceNo,
  ]);

  const setLocalStorage = (key, obj) => {
    localStorage.setItem(key, JSON.stringify(obj));
  };

  const onImageChangeDefaultSetting = (e) => {
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
        // var size = bytesToSize(file.size);
        var reader = new FileReader();
        reader.onload = function (e) {
          setImgSrc(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
    return false;
  };

  return (
    <div className="row mt-3">
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <ul
              className="nav nav-tabs card-header-tabs"
              id="myTab"
              role="tablist"
            >
              <li className="nav-item">
                <button
                  className="nav-link active"
                  id="defaultsettings-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#defaultsettings"
                  role="tab"
                  aria-controls="defaultsettings"
                  aria-selected="true"
                >
                  Default Settings
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link"
                  id="settings-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#settings"
                  role="tab"
                  aria-controls="settings"
                  aria-selected="false"
                >
                  PDF Settings
                </button>
              </li>
              {/* <li className="nav-item">
                <button
                  className="nav-link"
                  id="template-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#template"
                  role="tab"
                  aria-controls="template"
                  aria-selected="false"
                >
                  Template
                </button>
              </li> */}
            </ul>
          </div>
          <div className="card-body">
            <div className="tab-content" id="myTabContent">
              <div
                className="tab-pane fade show active"
                id="defaultsettings"
                role="tabpanel"
                tabIndex="0"
              >
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="files color">
                          <input
                            type="file"
                            className="form-control form-control-sm"
                            accept="image/x-png,image/jpg,image/jpeg"
                            id="customFile"
                            onChange={onImageChangeDefaultSetting}
                          />
                        </div>
                      </div>
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
                              onClick={() => setImgSrc("")}
                              className="btn btn-dark btn-sm preview-image-remove"
                            >
                              &times;
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="input-group mb-3">
                          <label
                            className="input-group-text"
                            htmlFor="defaultCurrency"
                          >
                            Currency
                          </label>
                          <select
                            className="form-select"
                            name="defaultCurrency"
                            id="defaultCurrency"
                            value={defaultCurrency}
                            onChange={(e) => setDefaultCurrency(e.target.value)}
                          >
                            {state.currency.map((item) => (
                              <option key={item.code} value={item.code}>
                                {item.name} ({item.code})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-group mb-3">
                          <label
                            className="input-group-text"
                            htmlFor="taxation"
                          >
                            Taxation
                          </label>
                          <select
                            className="form-select"
                            name="taxation"
                            id="taxation"
                            value={taxation}
                            onChange={(e) => setTaxation(e.target.value)}
                          >
                            {state.taxation.map((item) => (
                              <option key={item.code} value={item.code}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="input-group mb-3">
                      <label className="input-group-text" htmlFor="taxationPer">
                        {defaultSettings.taxation}
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Taxation Percentage"
                        id="taxationPer"
                        value={taxationPer}
                        onChange={(e) => setTaxationPer(e.target.value)}
                      />
                      <label className="input-group-text" htmlFor="discounts">
                        Discounts
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Discounts"
                        id="discounts"
                        value={discounts}
                        onChange={(e) => setDiscounts(e.target.value)}
                      />
                      <label className="input-group-text" htmlFor="shipping">
                        Shipping
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Shipping"
                        id="shipping"
                        value={shipping}
                        onChange={(e) => setShipping(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <div className="input-group">
                        <label className="input-group-text" htmlFor="InvoiceNo">
                          Invoice No
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Invoice No:"
                          id="InvoiceNo"
                          value={invoiceNo}
                          onChange={(e) => setInvoiceNo(e.target.value)}
                        />
                      </div>
                      <div className="form-text">
                        <ul className="list-inline">
                          <li className="list-inline-item">
                            <b>Example:</b>
                          </li>
                          <li className="list-inline-item">Invoice No:</li>
                          <li className="list-inline-item">Bill No:</li>
                          <li className="list-inline-item">
                            Proforma Invoice No:
                          </li>
                          <li className="list-inline-item">Receipt No:</li>
                          <li className="list-inline-item">Purchase Order:</li>
                        </ul>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="input-group">
                        <div className="input-group-text">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="AutoSetDueDate"
                              checked={autoDueDate}
                              onChange={(e) => setAutoDueDate(!autoDueDate)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="AutoSetDueDate"
                            >
                              Auto set Due Date
                            </label>
                          </div>
                        </div>
                        <span className="input-group-text">Today Date +</span>
                        <input
                          type="number"
                          className="form-control"
                          disabled={!autoDueDate}
                          min={0}
                          value={autoDueDays}
                          onChange={(e) =>
                            setAutoDueDays(parseInt(e.target.value))
                          }
                        />
                        <span className="input-group-text">No of Day(s)</span>
                      </div>
                      <div className="form-text">
                        <b>Example:</b>{" "}
                        <span>
                          {new Date().toLocaleDateString("en-CA")} + 7 Days ={" "}
                          {new Date(
                            new Date().setDate(new Date().getDate() + 7)
                          ).toLocaleDateString("en-CA")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group mb-3">
                      <label htmlFor="defaultInvoiceFrom">Invoice from</label>
                      <textarea
                        className="form-control"
                        id="defaultInvoiceFrom"
                        name="invoiceFrom"
                        rows="3"
                        placeholder="Who is this invoice from?"
                        value={invoiceFrom}
                        onChange={(e) => setInvoiceFrom(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group mb-3">
                      <label htmlFor="defaultTerms">Terms & Conditions</label>
                      <textarea
                        className="form-control"
                        id="defaultTerms"
                        name="terms"
                        rows="3"
                        placeholder="Terms and conditions - late fees, payment methods, delivery schedule"
                        value={terms}
                        onChange={(e) => setTerms(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group mb-3">
                      <label htmlFor="defaultFootNote">Foot Note</label>
                      <textarea
                        className="form-control"
                        id="defaultFooterNotes"
                        name="footNote"
                        rows="3"
                        placeholder="Thank you for your business"
                        value={footNote}
                        onChange={(e) => setFootNote(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="tab-pane fade"
                id="settings"
                role="tabpanel"
                tabIndex="0"
              >
                <div className="row">
                  <div className="col-md-3">
                    <p className="card-text">Background Color</p>
                    <SketchPicker
                      color={backgroundColor}
                      onChangeComplete={(color) =>
                        setBackgroundColor(color.hex)
                      }
                    />
                  </div>
                  <div className="col-md-9">
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <div className="input-group">
                          <label
                            htmlFor="pageOrientation"
                            className="input-group-text"
                          >
                            Page Orientation
                          </label>
                          <select
                            className="form-select"
                            name="pageOrientation"
                            id="pageOrientation"
                            value={pageOrientation}
                            onChange={(e) => setPageOrientation(e.target.value)}
                          >
                            {state.pageOrientation.map((item) => (
                              <option key={item} value={item}>
                                {item}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-group">
                          <label
                            htmlFor="pageSize"
                            className="input-group-text"
                          >
                            Page Size
                          </label>
                          <select
                            className="form-select"
                            name="pageSize"
                            id="pageSize"
                            value={pageSize}
                            onChange={(e) => setPageSize(e.target.value)}
                          >
                            {state.pageSize.map((item) => (
                              <option key={item} value={item}>
                                {item}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="row mb-3 g-3">
                      <div className="col-md-12">
                        <div className="card">
                          <h5 className="card-header">Watermark</h5>
                          <div className="card-body">
                            <div className="input-group mb-3">
                              <label
                                htmlFor="watermarkText"
                                className="input-group-text"
                              >
                                Text
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="watermarkText"
                                name="text"
                                maxLength="30"
                                onChange={(e) =>
                                  setWatermarkText(e.target.value)
                                }
                                value={watermarkText}
                              />
                            </div>
                            <div className="input-group">
                              <label
                                className="input-group-text"
                                htmlFor="opacity"
                              >
                                Opacity
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                id="opacity"
                                name="opacity"
                                min="0.1"
                                max="1"
                                step="0.1"
                                onChange={(e) =>
                                  setWatermarkOpacity(e.target.value)
                                }
                                value={watermarkOpacity}
                              />
                              <div className="input-group-text">
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="bold"
                                    name="bold"
                                    checked={watermarkBold}
                                    onChange={() =>
                                      setWatermarkBold(!watermarkBold)
                                    }
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="bold"
                                  >
                                    Bold
                                  </label>
                                </div>
                              </div>
                              <div className="input-group-text">
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="italics"
                                    name="italics"
                                    checked={watermarkItalics}
                                    onChange={() =>
                                      setWatermarkItalics(!watermarkItalics)
                                    }
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="italics"
                                  >
                                    Italics
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="card">
                          <div className="card-header">
                            <span className="h6 me-3">QR Code</span>
                            <div className="form-check form-switch form-check-inline">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="qrCodeActive"
                                checked={qrCodeActive}
                                onChange={() => setQrCodeActive(!qrCodeActive)}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="qrCodeActive"
                              >
                                Active
                              </label>
                            </div>
                          </div>
                          <div className="card-body">
                            <div className="input-group">
                              <label
                                htmlFor="qrCodeText"
                                className="input-group-text"
                              >
                                Text
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="qrCodeText"
                                onChange={(e) => setQrCodeText(e.target.value)}
                                value={qrCodeText}
                              />
                              <div className="input-group-text">
                                <div className="form-check form-switch">
                                  <label
                                    className="form-check-label"
                                    htmlFor="appendInvoiceNo"
                                  >
                                    Append Invoice No
                                  </label>
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="appendInvoiceNo"
                                    checked={qrCodeAppendInvoiceNo}
                                    onChange={() =>
                                      setQrCodeAppendInvoiceNo(
                                        !qrCodeAppendInvoiceNo
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="form-text mb-3">
                              <b>Example:</b>{" "}
                              <span>
                                https://www.example.com/pay?invoice=12345
                              </span>
                              <b className="ms-1">or</b>{" "}
                              <span>
                                What every text want to add in QR code
                              </span>
                            </div>
                            <div className="row g-3">
                              <div className="col-md-3">
                                <div className="input-group">
                                  <label
                                    htmlFor="qrCodeForeground"
                                    className="input-group-text"
                                  >
                                    Text/Foreground Color
                                  </label>
                                  <input
                                    type="color"
                                    className="form-control form-control-color"
                                    id="qrCodeForeground"
                                    onChange={(e) =>
                                      setQrCodeForeground(e.target.value)
                                    }
                                    value={qrCodeForeground}
                                  />
                                </div>
                              </div>
                              <div className="col-md-3">
                                <div className="input-group">
                                  <label
                                    htmlFor="qrCodeBackground"
                                    className="input-group-text"
                                  >
                                    Background Color
                                  </label>
                                  <input
                                    type="color"
                                    className="form-control form-control-color"
                                    id="qrCodeBackground"
                                    onChange={(e) =>
                                      setQrCodeBackground(e.target.value)
                                    }
                                    value={qrCodeBackground}
                                  />
                                </div>
                              </div>
                              <div className="col-md-3">
                                <div className="input-group">
                                  <label
                                    htmlFor="qrCodeEccLevel"
                                    className="input-group-text"
                                  >
                                    ECC Level
                                  </label>
                                  <select
                                    className="form-select"
                                    name="qrCodeEccLevel"
                                    id="qrCodeEccLevel"
                                    value={qrCodeEccLevel}
                                    onChange={(e) =>
                                      setQrCodeEccLevel(e.target.value)
                                    }
                                  >
                                    <option value="L">Low</option>
                                    <option value="M">Medium</option>
                                    <option value="Q">Quartile</option>
                                    <option value="H">High</option>
                                  </select>
                                  <span className="input-group-text">
                                    <a
                                      href="https://en.wikipedia.org/wiki/QR_code#Error_correction"
                                      rel="noreferrer"
                                      target="_blank"
                                    >
                                      wiki
                                    </a>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="tab-pane fade"
                id="template"
                role="tabpanel"
                tabIndex="0"
                aria-labelledby="template-tab"
              >
                <div className="row">
                  <div className="col-md-3 mb-4">
                    <div className="card">
                      <img
                        src={temp1}
                        className="card-img-top"
                        alt="Template 1"
                      />
                      <div className="card-body">
                        <div className="form-check">
                          <input
                            type="radio"
                            className="form-check-input"
                            id="temp1"
                            value="temp1"
                            checked={defaultTemplate === "temp1"}
                            onChange={() => setDefaultTemplate("temp1")}
                          />
                          <label className="form-check-label" htmlFor="temp1">
                            Template 1
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-4">
                    <div className="card">
                      <img
                        src={temp2}
                        className="card-img-top"
                        alt="Template 2"
                      />
                      <div className="card-body">
                        <div className="form-check">
                          <input
                            type="radio"
                            className="form-check-input"
                            id="temp2"
                            value="temp2"
                            checked={defaultTemplate === "temp2"}
                            onChange={() => setDefaultTemplate("temp2")}
                          />
                          <label className="form-check-label" htmlFor="temp2">
                            Template 2
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-4">
                    <div className="card">
                      <img
                        src={temp3}
                        className="card-img-top"
                        alt="Template 3"
                      />
                      <div className="card-body">
                        <div className="form-check">
                          <input
                            type="radio"
                            className="form-check-input"
                            id="temp3"
                            value="temp3"
                            checked={defaultTemplate === "temp3"}
                            onChange={() => setDefaultTemplate("temp3")}
                          />
                          <label className="form-check-label" htmlFor="temp3">
                            Template 3
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-4">
                    <div className="card">
                      <img
                        src={temp4}
                        className="card-img-top"
                        alt="Template 4"
                      />
                      <div className="card-body">
                        <div className="form-check">
                          <input
                            type="radio"
                            className="form-check-input"
                            id="temp4"
                            value="temp4"
                            checked={defaultTemplate === "temp4"}
                            onChange={() => setDefaultTemplate("temp4")}
                          />
                          <label className="form-check-label" htmlFor="temp4">
                            Template 4
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-4">
                    <div className="card">
                      <img
                        src={temp5}
                        className="card-img-top"
                        alt="Template 5"
                      />
                      <div className="card-body">
                        <div className="form-check">
                          <input
                            type="radio"
                            className="form-check-input"
                            id="temp5"
                            value="temp5"
                            checked={defaultTemplate === "temp5"}
                            onChange={() => setDefaultTemplate("temp5")}
                          />
                          <label className="form-check-label" htmlFor="temp5">
                            Template 5
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card">
                      <img
                        src={temp6}
                        className="card-img-top"
                        alt="Template 6"
                      />
                      <div className="card-body">
                        <div className="form-check">
                          <input
                            type="radio"
                            className="form-check-input"
                            id="temp6"
                            value="temp6"
                            checked={defaultTemplate === "temp6"}
                            onChange={() => setDefaultTemplate("temp6")}
                          />
                          <label className="form-check-label" htmlFor="temp6">
                            Template 6
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
