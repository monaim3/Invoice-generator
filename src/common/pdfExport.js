import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import  myfont from '../res/fonts/cambria.otf';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const customUnderlineStyle = {
  textDecoration: 'underline'
};
class pdfExport {
  static defaultSettings = localStorage.getItem("defaultSettings")
    ? JSON.parse(localStorage.getItem("defaultSettings"))
    : {
        defaultTemplate: "temp1",
      };

  static docDefinition = localStorage.getItem("docDefinition")
    ? JSON.parse(localStorage.getItem("docDefinition"))
    : {
        backgroundColor: "#0069D9",
        pageOrientation: "portrait",
        pageSize: "A4",
        border:10,
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
      };



  static setSettings = () => {
    if (localStorage.getItem("defaultSettings")) {
      this.defaultSettings = JSON.parse(
        localStorage.getItem("defaultSettings")
      );
    }
    if (localStorage.getItem("docDefinition")) {
      this.docDefinition = JSON.parse(localStorage.getItem("docDefinition"));
    }
  };
 
  static downloadInvoice = (obj) => {
    this.setSettings();
    let docDefinition = this.getTemplateWithDef(obj);
   
    pdfMake.createPdf(docDefinition).download("Invoice No#" + obj.invoiceNo);
  };

  static openInvoice = (obj) => {
    this.setSettings();
    let docDefinition = this.getTemplateWithDef(obj);
    pdfMake.createPdf(docDefinition).open();
  };

  static printInvoice = (obj) => {
    this.setSettings();
    let docDefinition = this.getTemplateWithDef(obj);
    pdfMake.createPdf(docDefinition).print();
  };

  // static dueTotal=(items)=>
  // items
  // .reduce((sum, item) => Number(sum) + Number(item.due), 0)
  // .toFixed(2);

  static getSubtotal = (items) =>
    items
      .reduce((sum, item) => Number(sum) + Number(item.amount), 0)
      .toFixed(2);

  static getTotal = (items, discounts, shipping) =>
    (
      this.getSubtotal(items) -
      Number(discounts || 0) +
      Number(shipping || 0)
    ).toFixed(2);

  static getTemplateWithDef = (obj) => {
    let docDef = null;
    switch (this.defaultSettings.defaultTemplate) {
      case "temp1":
        docDef = this.generateDocDef(obj);
        break;
      case "temp2":
        docDef = this.generateDocDefTemplate2(obj);
        break;
      case "temp3":
        docDef = this.generateDocDefTemplate3(obj);
        break;
      case "temp4":
        docDef = this.generateDocDefTemplate4(obj);
        break;
      case "temp5":
        docDef = this.generateDocDefTemplate5(obj);
        break;
      case "temp6":
        docDef = this.generateDocDefTemplate6(obj);
        break;
      default:
        docDef = this.generateDocDef(obj);
        break;
    }
  
    return docDef;
  };

  // Template 1 (Default)
  static generateDocDef = (obj) => {
    const numberToText = require('number-to-text')
    require('number-to-text/converters/en-us');
    var convertText= numberToText.convertToText(parseInt(this.getSubtotal(obj.items))).split(" ")
    //console.log(convertText.slice(0,2))
    const {
      backgroundColor,
      watermark,
      pageSize,
      pageOrientation,
      qrCodeActive,
      qrCode,
    } = this.docDefinition;
    
    let itemBody = [
      [
        { text: "#", style: "tableHeader" },
        { text: "Item", style: "tableHeader" },
        { text: "Qty", style: "tableHeader", alignment: "center" },
        { text: "Unit", style: "tableHeader", alignment: "center" },
        //{ text: "Due", style: "tableHeader", alignment: "center" },
        { text: "", style: "tableHeader", alignment: "center" },
        { text: "Rate", style: "tableHeader", alignment: "center" },
        // {
        //   text: obj?.taxation ?? "GST",
        //   style: "tableHeader",
        //   alignment: "center",
        // },
        { text: "Amount", style: "tableHeader", alignment: "right" },
      ],
    ];
    let itemArr = ["", "", "", "", "", "", "",];
    if (obj.items.length === 0) itemBody.push(itemArr);
    for (let index = 0; index < obj.items.length; index++) {
      const element = obj.items[index];
      console.log(element);
      itemBody.push([
        index + 1,
        element.title,
        { text: element.quantity, alignment: "center" },
        { text: element.unit, alignment: "center" },
       // { text: element.due, alignment: "center" },
        { text: null, alignment: "left" },
        { text: element.rate, alignment: "left" },
        
        // { text: element.taxationPer, alignment: "center" },
        { text: element.amount, alignment: "right" },
      ]);
    }

    let subTotalArr = [
      {
        width: "*",
        margin: [-180, 0, 0, 0],
        columns: [
          {
            width: "*",
            text: [
              {
                text: "Subtotal",
                alignment: "right",
                lineHeight: 1.2,
              },
              "\n",
             
              {
                text: "Cash",
                alignment: "right",
                lineHeight: 1.2,
              },
              "\n",
              // {
              //   text: "Shipping",
              //   alignment: "right",
              //   lineHeight: 1.2,
              // },
              // "\n",
              {
                canvas: [
                  {
                    type: "line",
                    x1: 0,
                    y1: 5,
                    x2: 250,
                    y2: 5,
                    lineWidth: 3,
                  },
                ],
              },
              {
                text: "Due (" + (obj.currency || "Taka") + ")",
                fontSize: 12,
                bold: true,
                alignment: "right",
              },
              "\n",
              "\n",
               {
                //margin: [-100, 0, 0, 0],
                text: "In Words:" + convertText.slice(0,3),
                alignment: "right",
                lineHeight: 1.2,
              },
              "\n",
              "\n",
              "\n",
             
              {
                text: "Signature",
                fontSize: 12,
                bold: true,
                textDecoration: 'underline',
                decoration: "underline",
                alignment: "right",
                textDecoration: true
              },
             
              
              // {
              //   text: "Due",
              //   bold: true,
              //   alignment: "right",
              //   lineHeight: 1.2,
              // },
              
            ],
          },
          {
            width: "auto",
           // margin: [-10, 0, 0, 0],
            text: [
              {
                text: this.getSubtotal(obj.items),
                alignment: "right",
                lineHeight: 1.2,
              },
              "\n",
             
              {
                text: obj.discounts > 0 ?  obj.discounts : obj.discounts,
                alignment: "right",
                lineHeight: 1.2,
              },
              // "\n",
              // {
              //   text: obj.shipping,
              //   alignment: "right",
              //   lineHeight: 1.2,
              // },
              "\n",
              {
                text: this.getTotal(obj.items, obj.discounts, obj.shipping),
                fontSize: 12,
                bold: true,
                alignment: "right",
              },
              "\n",
              "\n",
             
              {
                text: convertText.slice(3,convertText.length),
                alignment: "left",
                lineHeight: 1.2,
                fontSize: 12,
                margin: [-10, 0, 0, 0],
              },
              "\n",
              "\n",
              // {
              //   text: this.dueTotal(obj.items),
              //   alignment: "right",
              //   lineHeight: 1.2,
              // },
              // "\n",
            ],
          },
        ],
      },
    ];
    if (qrCodeActive && (qrCode?.qr || qrCode?.appendInvoiceNo)) {
      subTotalArr.push("\n\n");
      subTotalArr.push({
        qr: qrCode.qr + (qrCode?.appendInvoiceNo === true ? obj.invoiceNo : ""),
        foreground: qrCode.foreground,
        background: qrCode.background,
        alignment: "right",
        fit: 130,
        eccLevel: qrCode.eccLevel,
      });
    }
    var docDefinition = {
      pageSize: pageSize,
      pageOrientation: pageOrientation,
      watermark: {
        text: watermark.text,
        color: backgroundColor,
        opacity: Number(watermark.opacity),
        bold: watermark.bold,
        italics: watermark.italics,
      },
      info: {
        title: "Invoice No#" + obj.invoiceNo,
        author: "Invoice Generator",
        subject: "Invoice No#" + obj.invoiceNo,
        keywords: "Invoice No#" + obj.invoiceNo,
      },
      footer: function (currentPage, pageCount, pageSize) {
        return [
         

          {
            // margin: [90, 2, 0, 0],
            margin: [20, -20, 20, 20],
            padding:[50,0,0,20],
            // position: "fixed",
            // bottom: 0,
            borderRadius: 10,
            // alignment: "center",
            alignment:"start",
            columns: [
              {
                image: obj.brandLogo.logo1,
                width: 40,
                height: 40,
              },
              {
                image: obj.brandLogo.logo2,
                width: 40,
                height: 40,
              },
              {
                image: obj.brandLogo.logo3,
                width: 40,
                height: 40,
              },
              {
                image: obj.brandLogo.logo4,
                width: 60,
                height: 40,
              },
              {
                image: obj.brandLogo.logo5,
                width: 40,
                height: 40,
              },
              {
                image: obj.brandLogo.logo6,
                width: 40,
                height: 40,
              },
              {
                image: obj.brandLogo.logo7,
                width: 40,
                height: 40,
              },
              {
                image: obj.brandLogo.logo8,
                width: 40,
                height: 40,
              },
              {
                image: obj.brandLogo.logo9,
                width: 40,
                height: 40,
              },
              {
                image: obj.brandLogo.logo10,
                width: 40,
                height: 40,
              },
            ],
          },

          {
            canvas: [
              {
                type: "rect",
                x: 0,
                y: 0,
                w: pageSize.width,
                h: 5,
                color: backgroundColor,
              },
            ],
          },
        
          {
            table: {
              widths: ["80%", "20%"],
              body: [
                [
                  {
                    text: obj.footNote,
                    alignment: "left",
                    fontSize: 7,
                    margin: [40, 0, 0, 0],
                  },
                  {
                    text:
                      "Page " +
                      currentPage.toString() +
                      " of " +
                      pageCount +
                      "   ",
                    alignment: "right",
                    margin: [0, 10, 40, 0],
                  },
                ],
              ],
            },
            layout: "noBorders",
          },
        ];
      },
      header: function (currentPage, pageCount, pageSize) {
        return [
          
          {
            // canvas: [
            //   {
            //     type: "rect",
            //     // x: 0,
            //     // y: 10,
            //     w: pageSize.width,
            //     h: 15,
                
            //    // color: backgroundColor,
            //   },
            // ],
          },
        ];
      },
      content: [
        {
          columns: [
           
            {
              width: "auto",
              columns: [
                  {
                    image: obj.brandLogo.milon,
                      width: 60,
                      height: 40,
                  },
              ],
          },
            {
              width: 300,
              margin: [0, 0, 0, 0],
              text: [
                {
                  text: `MILON MOTORS`,
                  fontSize: 40,
                  italics:true,
                  //font:"roboto",
                  bold: true,
                  alignment: "center",
                  lineHeight: 1.2,
                },
                "\n",
                {
                  text: "Special,For,Toyota,Nissan,Mitsubishi,Honda,Mazda,",
                  alignment: "center",
                  fontSize: 12,
                  italics:true,
                  color:"#3f81c3",
                },
                "\n",
                {
                  text: "Hyundai,Bmw,Mercedes,And,haval Great wall",
                  alignment: "center",
                  fontSize: 12,
                  italics:true,
                  color:"#3f81c3",
                },
                "\n",
                {
                  text: "87 NEW ROAD HOME TOWN AC MARKET BANGLA MOTOR DHAKA 1000",
                  alignment: "center",
                  fontSize: 12,
                  italics:true,
                  color:"black",
                },
                "\n",

                {
                  text: "All Kinds Of Motors,Vehicle Parts,Importer,WholeSaler & Retail Supplier",
                  alignment: "center",
                  fontSize: 12,
                  italics:true,
                  color:"#3f81c3",
                },
                "\n",
                {
                  text: "milonmotors@gmail.com milonmotors@yahoo.com",
                  alignment: "center",
                  fontSize: 12,
                  italics:true,
                  
                },
                "\n",
                {
                  text: "01799446060  01977225577",
                  alignment: "center",
                  fontSize: 15,
                  margin: [0, 10, 0, 10],
                  color:"black"
                },
              ],
            },
            {
              width: "auto",
              columns: [
                  {
                      image: obj.brandLogo.visa,
                      width: 70,
                      height: 30,
                      margin: [0, 10, 0, 0],
                  },
                  {
                    text: [
                      {
                        text: `${obj.title} Invoice No: #${obj.invoiceNo}`,
                        fontSize: 13,
                        bold: true,
                        alignment: "right",
                        // lineHeight: 1.2,
                      },
                      "\n",
      
                      {
                        text: " Date: " + obj.invoiceDate,
                        alignment: "right",
                      },
                     
                      // {
                      //   text: "Due Date: " + obj.dueDate,
                      //   alignment: "right",
                      // },
                    ],
                  },
              ],
          },
           //test start 
          
          ],

          //test columns start
          // columns2: [
           
          //   {
          //     width: "auto",
          //     margin: [20, 0, 0, 0],
          //     text: [
               
          //       {
          //         text: "Test Data",
          //         alignment: "center",
          //         fontSize: 15,
          //         margin: [0, 10, 0, 10],
          //         color:"black"
          //       },
          //     ],
          //   },
            
          // ],

        },
        {
          style: "tableExample",
          table: {
            headerRows: 1,
            widths: ["auto", "*"],
            // dontBreakRows: true,
            // keepWithHeaderRows: 1,
            body: [
              [
                { text: "Bill From", style: "tableHeader" },
                { text: "Bill For", style: "tableHeader" },
              ],
              [obj.invoiceFrom, obj.invoiceTo],
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return rowIndex === 0 ? "#CCCCCC" : null;
            },
          },
        },
        {
          style: "tableExample",
          table: {
            headerRows: 1,
           widths: ["auto", "*", 50, 60, 30, 30, 80,],
            //widths: [50,30, 50, 60, 30, 30,30, 50],
            // keepWithHeaderRows: 1,
            body: itemBody,
          },
          layout: "lightHorizontalLines",
        },
        {
          columns: [
            {
              width: "70%",
              text: [
                {
                  text:
                    obj.terms !== "" ? "Terms & Conditions\n" + obj.terms : "",
                  fontSize: 10,
                },
              ],
            },
            subTotalArr,
          ],
        },
        // {
        //   columns: [
        //     {
        //       width: "auto",
        //       margin: [25, 300, 0, 0],
        //       // position: "fixed",
        //       // bottom: 0,
        //       borderRadius: 10,
        //       columns: [
        //         {
        //           image: obj.footerLogos.logo1
        //             ? obj.footerLogos.logo1
        //             : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
        //           width: 75,
        //           height: 75,
        //           borderRadius: 10,
        //         },
        //         {
        //           image: obj.footerLogos.logo2
        //             ? obj.footerLogos.logo2
        //             : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
        //           width: 100,
        //           height: 100,
        //         },
        //         {
        //           image: obj.footerLogos.logo3
        //             ? obj.footerLogos.logo3
        //             : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
        //           width: 100,
        //           height: 100,
        //         },
        //         {
        //           image: obj.footerLogos.logo4
        //             ? obj.footerLogos.logo4
        //             : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
        //           width: 100,
        //           height: 100,
        //         },
        //       ],
        //     },

        //     // {
        //     //   width: "*",
        //     //   text: [
        //     //     {
        //     //       text: `${obj.title} #${obj.invoiceNo}`,
        //     //       fontSize: 15,
        //     //       bold: true,
        //     //       alignment: "right",
        //     //       lineHeight: 1.2,
        //     //     },
        //     //     "\n",
        //     //     {
        //     //       text: "Invoice Date: " + obj.invoiceDate,
        //     //       alignment: "right",
        //     //     },
        //     //     "\n",
        //     //     {
        //     //       text: "Due Date: " + obj.dueDate,
        //     //       alignment: "right",
        //     //     },
        //     //   ],
        //     // },
        //   ],
        // },
        {
          // columns: [
          //   {
          //     width: "*",
          //     margin: [0,10, 10, 0],
          //     text: [
          //       {
          //         text: `Copyright 2023 Milon Motors`,
          //         fontSize: 15,
          //         bold: true,
          //         alignment: "center",
          //         lineHeight: 1.2,
          //       },
          //     ],
          //   },
          // ],
        },
      ],
    

      // styles
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        tableExample: {
          margin: [0, 5, 0, 15],
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: "black",
        },
      },
      defaultStyle: {
        columnGap: 15,
      },
    };
    return docDefinition;
  };
  // // template -----------------------------
  //   // Template 2
  //   static generateDocDefTemplate2 = (obj) => {
  //     const {
  //       backgroundColor,
  //       watermark,
  //       pageSize,
  //       pageOrientation,
  //       qrCodeActive,
  //       qrCode,
  //     } = this.docDefinition;
  //     let itemBody = [
  //       [
  //         { text: "#", style: "tableHeader", alignment: "right", color: "white" },
  //         { text: "Item", style: "tableHeader", color: "white" },
  //         {
  //           text: "Qty",
  //           style: "tableHeader",
  //           alignment: "center",
  //           color: "white",
  //         },
  //         {
  //           text: "Rate",
  //           style: "tableHeader",
  //           alignment: "right",
  //           color: "white",
  //         },
  //         {
  //           text: obj?.taxation ?? "GST",
  //           style: "tableHeader",
  //           alignment: "center",
  //           color: "white",
  //         },
  //         {
  //           text: "Amount",
  //           style: "tableHeader",
  //           alignment: "right",
  //           color: "white",
  //         },
  //       ],
  //     ];
  //     let itemArr = ["", "", "", "", "", ""];
  //     if (obj.items.length === 0) itemBody.push(itemArr);
  //     for (let index = 0; index < obj.items.length; index++) {
  //       const element = obj.items[index];
  //       itemBody.push([
  //         { text: index + 1, alignment: "right" },
  //         element.title,
  //         { text: element.quantity, alignment: "center" },
  //         { text: element.rate, alignment: "right" },
  //         { text: element.taxationPer, alignment: "center" },
  //         { text: element.amount, alignment: "right" },
  //       ]);
  //     }
  //     pdfMake.tableLayouts = {
  //       exampleLayout: {
  //         hLineWidth: function (i, node) {
  //           if (i === 0 || i === node.table.body.length) {
  //             return 0;
  //           }
  //           return i === node.table.headerRows ? 2 : 1;
  //         },
  //         vLineWidth: function (i) {
  //           return 0;
  //         },
  //         hLineColor: function (i, node) {
  //           return i === 1 ? "black" : "#aaa";
  //         },
  //         fillColor: function (i, node) {
  //           return i === 0 ? backgroundColor : i % 2 === 0 ? "#CCCCCC" : null;
  //         },
  //         paddingLeft: function (i) {
  //           return i === 0 ? 8 : 8;
  //         },
  //         paddingRight: function (i, node) {
  //           //return i === node.table.widths.length - 1 ? 0 : 8;
  //           return 3;
  //         },
  //         paddingTop: function (i, node) {
  //           return 3;
  //         },
  //         paddingBottom: function (i, node) {
  //           return 3;
  //         },
  //       },
  //     };
  //     let qrArr = [];
  //     if (qrCodeActive && (qrCode?.qr || qrCode?.appendInvoiceNo)) {
  //       qrArr.push({
  //         qr: qrCode.qr + (qrCode?.appendInvoiceNo === true ? obj.invoiceNo : ""),
  //         foreground: qrCode.foreground,
  //         background: qrCode.background,
  //         alignment: "left",
  //         fit: 130,
  //         eccLevel: qrCode.eccLevel,
  //       });
  //     }
  //     var docDefinition = {
  //       pageSize: pageSize,
  //       pageOrientation: pageOrientation,
  //       watermark: {
  //         text: watermark.text,
  //         color: backgroundColor,
  //         opacity: Number(watermark.opacity),
  //         bold: watermark.bold,
  //         italics: watermark.italics,
  //       },
  //       info: {
  //         title: "Invoice No#" + obj.invoiceNo,
  //         author: "Invoice Generator",
  //         subject: "Invoice No#" + obj.invoiceNo,
  //         keywords: "Invoice No#" + obj.invoiceNo,
  //       },
  //       footer: function (currentPage, pageCount, pageSize) {
  //         return [
  //           {
  //             canvas: [
  //               {
  //                 type: "rect",
  //                 x: 0,
  //                 y: 0,
  //                 w: pageSize.width,
  //                 h: 3,
  //                 color: backgroundColor,
  //               },
  //             ],
  //           },
  //           {
  //             table: {
  //               widths: ["80%", "20%"],
  //               body: [
  //                 [
  //                   {
  //                     text: obj.footNote,
  //                     alignment: "left",
  //                     fontSize: 7,
  //                     margin: [40, 0, 0, 0],
  //                   },
  //                   {
  //                     text:
  //                       "Page " +
  //                       currentPage.toString() +
  //                       " of " +
  //                       pageCount +
  //                       "   ",
  //                     alignment: "right",
  //                     margin: [0, 10, 40, 0],
  //                   },
  //                 ],
  //               ],
  //             },
  //             layout: "noBorders",
  //           },
  //         ];
  //       },
  //       header: function (currentPage, pageCount, pageSize) {
  //         return [
  //           {
  //             canvas: [
  //               {
  //                 type: "rect",
  //                 x: 0,
  //                 y: 10,
  //                 w: pageSize.width,
  //                 h: 3,
  //                 color: backgroundColor,
  //               },
  //             ],
  //           },
  //         ];
  //       },
  //       content: [
  //         {
  //           columns: [
  //             {
  //               width: "auto",
  //               columns: [
  //                 {
  //                   image: obj.imgSrc
  //                     ? obj.imgSrc
  //                     : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  //                   width: 100,
  //                   height: 100,
  //                 },
  //               ],
  //             },
  //             {
  //               width: "*",
  //               text: [
  //                 {
  //                   text: obj.invoiceFrom,
  //                 },
  //               ],
  //             },
  //             {
  //               width: "*",
  //               text: [
  //                 {
  //                   text: `${obj.title} #${obj.invoiceNo}`,
  //                   fontSize: 15,
  //                   bold: true,
  //                   alignment: "right",
  //                   lineHeight: 1.2,
  //                 },
  //                 "\n",
  //                 {
  //                   text: "Invoice Date: " + obj.invoiceDate,
  //                   alignment: "right",
  //                 },
  //                 "\n",
  //                 {
  //                   text: "Due Date: " + obj.dueDate,
  //                   alignment: "right",
  //                 },
  //               ],
  //             },
  //           ],
  //         },

  //         "\nBill To",
  //         {
  //           canvas: [
  //             { type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 },
  //           ],
  //         },
  //         obj.invoiceTo,
  //         "\n",
  //         {
  //           style: "tableExample",
  //           table: {
  //             headerRows: 1,
  //             widths: ["auto", "*", 50, 60, 30, 80],
  //             // keepWithHeaderRows: 1,
  //             body: itemBody,
  //           },
  //           layout: "exampleLayout",
  //           dontBreakRows: true,
  //         },
  //         {
  //           columns: [
  //             {
  //               width: "*",
  //               stack: qrArr,
  //             },
  //             {
  //               width: "auto",
  //               columns: [
  //                 {
  //                   width: "*",
  //                   text: [
  //                     {
  //                       text: "Subtotal",
  //                       alignment: "right",
  //                       lineHeight: 1.2,
  //                     },
  //                     "\n",
  //                     {
  //                       text: "Discounts",
  //                       alignment: "right",
  //                       lineHeight: 1.2,
  //                     },
  //                     "\n",
  //                     {
  //                       text: "Shipping",
  //                       alignment: "right",
  //                       lineHeight: 1.2,
  //                     },
  //                     "\n",
  //                     {
  //                       text: "\t\t\tTotal (" + (obj.currency || "USD") + ")",
  //                       fontSize: 12,
  //                       bold: true,
  //                       alignment: "right",
  //                       background: backgroundColor,
  //                       color: "#FFF",
  //                     },
  //                   ],
  //                 },
  //                 {
  //                   width: "auto",
  //                   text: [
  //                     {
  //                       text: this.getSubtotal(obj.items),
  //                       alignment: "right",
  //                       lineHeight: 1.2,
  //                     },
  //                     "\n",
  //                     {
  //                       text:
  //                         obj.discounts > 0 ? "-" + obj.discounts : obj.discounts,
  //                       alignment: "right",
  //                       lineHeight: 1.2,
  //                     },
  //                     "\n",
  //                     {
  //                       text: obj.shipping,
  //                       alignment: "right",
  //                       lineHeight: 1.2,
  //                     },
  //                     "\n",
  //                     {
  //                       text: this.getTotal(
  //                         obj.items,
  //                         obj.discounts,
  //                         obj.shipping
  //                       ),
  //                       fontSize: 12,
  //                       bold: true,
  //                       alignment: "right",
  //                       background: backgroundColor,
  //                       color: "#FFF",
  //                     },
  //                   ],
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //         {
  //           text: [
  //             {
  //               text:
  //                 obj.terms !== "" ? "\nTerms & Conditions\n" + obj.terms : "",
  //               fontSize: 10,
  //             },
  //           ],
  //         },
  //       ],
  //       styles: {
  //         header: {
  //           fontSize: 18,
  //           bold: true,
  //           margin: [0, 0, 0, 10],
  //         },
  //         subheader: {
  //           fontSize: 16,
  //           bold: true,
  //           margin: [0, 10, 0, 5],
  //         },
  //         tableExample: {
  //           margin: [0, 5, 0, 15],
  //         },
  //         tableHeader: {
  //           bold: true,
  //           fontSize: 13,
  //           color: "black",
  //         },
  //       },
  //       defaultStyle: {
  //         columnGap: 15,
  //       },
  //     };

  //     return docDefinition;
  //   };

  //   // Template 3
  //   static generateDocDefTemplate3 = (obj) => {
  //     const {
  //       backgroundColor,
  //       watermark,
  //       pageSize,
  //       pageOrientation,
  //       qrCodeActive,
  //       qrCode,
  //     } = this.docDefinition;
  //     let itemBody = [
  //       [
  //         { text: "#", style: "tableHeader", alignment: "right", color: "white" },
  //         { text: "Item", style: "tableHeader", color: "white" },
  //         {
  //           text: "Qty",
  //           style: "tableHeader",
  //           alignment: "center",
  //           color: "white",
  //         },
  //         {
  //           text: "Rate",
  //           style: "tableHeader",
  //           alignment: "right",
  //           color: "white",
  //         },
  //         {
  //           text: obj?.taxation ?? "GST",
  //           style: "tableHeader",
  //           alignment: "center",
  //           color: "white",
  //         },
  //         {
  //           text: "Amount",
  //           style: "tableHeader",
  //           alignment: "right",
  //           color: "white",
  //         },
  //       ],
  //     ];
  //     let itemArr = ["", "", "", "", "", ""];
  //     if (obj.items.length === 0) itemBody.push(itemArr);
  //     for (let index = 0; index < obj.items.length; index++) {
  //       const element = obj.items[index];
  //       itemBody.push([
  //         { text: index + 1, alignment: "right" },
  //         element.title,
  //         { text: element.quantity, alignment: "center" },
  //         { text: element.rate, alignment: "right" },
  //         { text: element.taxationPer, alignment: "center" },
  //         { text: element.amount, alignment: "right" },
  //       ]);
  //     }
  //     pdfMake.tableLayouts = {
  //       totalLayout: {
  //         hLineWidth: function (i, node) {
  //           return 1;
  //         },
  //         vLineWidth: function (i) {
  //           return 0;
  //         },
  //         hLineColor: function (i, node) {
  //           return "#aaa";
  //         },
  //         fillColor: function (i, node) {
  //           return i === 0 ? "#e8e8e8" : i % 2 === 0 ? "#e8e8e8" : null;
  //         },
  //         paddingLeft: function (i) {
  //           return i === 0 ? 8 : 8;
  //         },
  //         paddingRight: function (i, node) {
  //           //return i === node.table.widths.length - 1 ? 0 : 8;
  //           return 3;
  //         },
  //         paddingTop: function (i, node) {
  //           return 3;
  //         },
  //         paddingBottom: function (i, node) {
  //           return 3;
  //         },
  //       },
  //       exampleLayout: {
  //         hLineWidth: function (i, node) {
  //           if (i === 0 || i === node.table.body.length) {
  //             return 0;
  //           }
  //           return i === node.table.headerRows ? 2 : 1;
  //         },
  //         vLineWidth: function (i) {
  //           return 0;
  //         },
  //         hLineColor: function (i, node) {
  //           return i === 1 ? "black" : "#aaa";
  //         },
  //         fillColor: function (i, node) {
  //           return i === 0 ? backgroundColor : i % 2 === 0 ? "#e8e8e8" : null;
  //         },
  //         paddingLeft: function (i) {
  //           return i === 0 ? 8 : 8;
  //         },
  //         paddingRight: function (i, node) {
  //           //return i === node.table.widths.length - 1 ? 0 : 8;
  //           return 3;
  //         },
  //         paddingTop: function (i, node) {
  //           return 3;
  //         },
  //         paddingBottom: function (i, node) {
  //           return 3;
  //         },
  //       },
  //     };
  //     // -- Set the report date for display only.
  //     let reportDate = new Date().toDateString();
  //     let qrArr = [];
  //     if (qrCodeActive && (qrCode?.qr || qrCode?.appendInvoiceNo)) {
  //       qrArr.push("\n");
  //       qrArr.push({
  //         qr: qrCode.qr + (qrCode?.appendInvoiceNo === true ? obj.invoiceNo : ""),
  //         foreground: qrCode.foreground,
  //         background: qrCode.background,
  //         alignment: "left",
  //         fit: 130,
  //         eccLevel: qrCode.eccLevel,
  //       });
  //     }
  //     var docDefinition = {
  //       pageSize: pageSize,
  //       pageOrientation: pageOrientation,
  //       watermark: {
  //         text: watermark.text,
  //         color: backgroundColor,
  //         opacity: Number(watermark.opacity),
  //         bold: watermark.bold,
  //         italics: watermark.italics,
  //       },
  //       info: {
  //         title: "Invoice No#" + obj.invoiceNo,
  //         author: "Invoice Generator",
  //         subject: "Invoice No#" + obj.invoiceNo,
  //         keywords: "Invoice No#" + obj.invoiceNo,
  //       },
  //       footer: function (currentPage, pageCount, pageSize) {
  //         return {
  //           text: `${reportDate} : Page ${currentPage.toString()} of ${pageCount.toString()}`,
  //           alignment: "center",
  //           fontSize: 7,
  //         };
  //       },
  //       header: function (currentPage, pageCount, pageSize) {
  //         return [
  //           {
  //             canvas: [
  //               {
  //                 type: "rect",
  //                 x: 0,
  //                 y: 10,
  //                 w: pageSize.width,
  //                 h: 3,
  //                 color: backgroundColor,
  //               },
  //             ],
  //           },
  //         ];
  //       },
  //       content: [
  //         {
  //           columns: [
  //             {
  //               width: "*",
  //               text: [
  //                 {
  //                   text: obj.invoiceFrom,
  //                 },
  //               ],
  //             },
  //             {
  //               width: "auto",
  //               columns: [
  //                 {
  //                   image: obj.imgSrc
  //                     ? obj.imgSrc
  //                     : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  //                   width: 100,
  //                   height: 100,
  //                 },
  //               ],
  //             },

  //             {
  //               width: "*",
  //               text: [
  //                 {
  //                   text: `${obj.title} #${obj.invoiceNo}`,
  //                   fontSize: 15,
  //                   bold: true,
  //                   alignment: "right",
  //                   lineHeight: 1.2,
  //                 },
  //                 "\n",
  //                 {
  //                   text: "Invoice Date: " + obj.invoiceDate,
  //                   alignment: "right",
  //                 },
  //                 "\n",
  //                 {
  //                   text: "Due Date: " + obj.dueDate,
  //                   alignment: "right",
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //         {
  //           layout: "lightHorizontalLines", // optional
  //           table: {
  //             // headers are automatically repeated if the table spans over multiple pages
  //             // you can declare how many rows should be treated as headers
  //             headerRows: 1,
  //             widths: ["*"],

  //             body: [
  //               [{ text: "Bill To", bold: true, fillColor: "#F9F9F9" }],
  //               [{ text: obj.invoiceTo, fillColor: "#F9F9F9" }],
  //             ],
  //           },
  //         },
  //         "\n",
  //         {
  //           margin: [0, 0, 0, 0],
  //           layout: "exampleLayout",
  //           dontBreakRows: true,
  //           table: {
  //             headerRows: 1,
  //             widths: ["auto", "*", 50, 60, 30, 80],
  //             // keepWithHeaderRows: 1,
  //             body: itemBody,
  //           },
  //         },

  //         {
  //           columns: [
  //             {
  //               width: "*",
  //               stack: qrArr,
  //             },
  //             {
  //               width: "auto",
  //               columns: [
  //                 {
  //                   layout: "totalLayout",
  //                   table: {
  //                     // headers are automatically repeated if the table spans over multiple pages
  //                     // you can declare how many rows should be treated as headers
  //                     headerRows: 0,
  //                     widths: ["*", 80],

  //                     body: [
  //                       [
  //                         { text: "Subtotal", bold: true, alignment: "right" },
  //                         {
  //                           text: this.getSubtotal(obj.items),
  //                           bold: false,
  //                           alignment: "right",
  //                         },
  //                       ],
  //                       [
  //                         { text: "Discounts", bold: true, alignment: "right" },
  //                         {
  //                           text:
  //                             obj.discounts > 0
  //                               ? "-" + obj.discounts
  //                               : obj.discounts,
  //                           bold: false,
  //                           alignment: "right",
  //                         },
  //                       ],
  //                       [
  //                         { text: "Shipping", bold: true, alignment: "right" },
  //                         {
  //                           text: obj.shipping,
  //                           bold: false,
  //                           alignment: "right",
  //                         },
  //                       ],
  //                       [
  //                         {
  //                           text: "Total (" + (obj.currency || "USD") + ")",
  //                           bold: true,
  //                           alignment: "right",
  //                         },
  //                         {
  //                           text: this.getTotal(
  //                             obj.items,
  //                             obj.discounts,
  //                             obj.shipping
  //                           ),
  //                           bold: false,
  //                           alignment: "right",
  //                         },
  //                       ],
  //                     ],
  //                   },
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //         {
  //           stack: [
  //             {
  //               text:
  //                 obj.terms !== "" ? "\nTerms & Conditions\n" + obj.terms : "",
  //               fontSize: 10,
  //             },
  //             "\n\n\n\n\n",
  //             { text: "Signature / Stamp", color: backgroundColor },
  //             { text: "Place: " },
  //             { text: "Date: " },
  //           ],
  //         },
  //       ],
  //       styles: {
  //         header: {
  //           fontSize: 18,
  //           bold: true,
  //           margin: [0, 0, 0, 10],
  //         },
  //         subheader: {
  //           fontSize: 16,
  //           bold: true,
  //           margin: [0, 10, 0, 5],
  //         },
  //         tableExample: {
  //           margin: [0, 5, 0, 15],
  //         },
  //         tableHeader: {
  //           bold: true,
  //           fontSize: 13,
  //           color: "black",
  //         },
  //       },
  //       defaultStyle: {
  //         columnGap: 15,
  //       },
  //     };

  //     return docDefinition;
  //   };

  //   // Template 4
  //   static generateDocDefTemplate4 = (obj) => {
  //     const {
  //       backgroundColor,
  //       watermark,
  //       pageSize,
  //       pageOrientation,
  //       qrCodeActive,
  //       qrCode,
  //     } = this.docDefinition;
  //     let itemBody = [
  //       [
  //         { text: "#", style: "tableHeader", alignment: "right", color: "white" },
  //         { text: "Item", style: "tableHeader", color: "white" },
  //         {
  //           text: "Qty",
  //           style: "tableHeader",
  //           alignment: "center",
  //           color: "white",
  //         },
  //         {
  //           text: "Rate",
  //           style: "tableHeader",
  //           alignment: "right",
  //           color: "white",
  //         },
  //         {
  //           text: obj?.taxation ?? "GST",
  //           style: "tableHeader",
  //           alignment: "center",
  //           color: "white",
  //         },
  //         {
  //           text: "Amount",
  //           style: "tableHeader",
  //           alignment: "right",
  //           color: "white",
  //         },
  //       ],
  //     ];
  //     let itemArr = ["", "", "", "", "", ""];
  //     if (obj.items.length === 0) itemBody.push(itemArr);
  //     for (let index = 0; index < obj.items.length; index++) {
  //       const element = obj.items[index];
  //       itemBody.push([
  //         { text: index + 1, alignment: "right" },
  //         element.title,
  //         { text: element.quantity, alignment: "center" },
  //         { text: element.rate, alignment: "right" },
  //         { text: element.taxationPer, alignment: "center" },
  //         { text: element.amount, alignment: "right" },
  //       ]);
  //     }
  //     pdfMake.tableLayouts = {
  //       totalLayout: {
  //         hLineWidth: function (i, node) {
  //           return 1;
  //         },
  //         vLineWidth: function (i) {
  //           return 0;
  //         },
  //         hLineColor: function (i, node) {
  //           return "#aaa";
  //         },
  //         fillColor: function (i, node) {
  //           return i === 0 ? "#e8e8e8" : i % 2 === 0 ? "#e8e8e8" : null;
  //         },
  //         paddingLeft: function (i) {
  //           return i === 0 ? 8 : 8;
  //         },
  //         paddingRight: function (i, node) {
  //           //return i === node.table.widths.length - 1 ? 0 : 8;
  //           return 3;
  //         },
  //         paddingTop: function (i, node) {
  //           return 3;
  //         },
  //         paddingBottom: function (i, node) {
  //           return 3;
  //         },
  //       },
  //       exampleLayout: {
  //         hLineWidth: function (i, node) {
  //           if (i === 0 || i === node.table.body.length) {
  //             return 1;
  //           }
  //           return i === node.table.headerRows ? 2 : 1;
  //         },
  //         vLineWidth: function (i) {
  //           return 1;
  //         },
  //         hLineColor: function (i, node) {
  //           if (i === 0 || i === node.table.body.length) {
  //             return "black";
  //           }
  //           return i === 1 ? "black" : "#aaa";
  //         },
  //         fillColor: function (i, node) {
  //           return i === 0 ? backgroundColor : i % 2 === 0 ? "#e8e8e8" : null;
  //         },
  //         paddingLeft: function (i) {
  //           return i === 0 ? 8 : 8;
  //         },
  //         paddingRight: function (i, node) {
  //           //return i === node.table.widths.length - 1 ? 0 : 8;
  //           return 3;
  //         },
  //         paddingTop: function (i, node) {
  //           return 3;
  //         },
  //         paddingBottom: function (i, node) {
  //           return 3;
  //         },
  //       },
  //     };
  //     // -- Set the report date for display only.
  //     let reportDate = new Date().toDateString();
  //     let qrArr = [];
  //     if (qrCodeActive && (qrCode?.qr || qrCode?.appendInvoiceNo)) {
  //       qrArr.push("\n");
  //       qrArr.push({
  //         qr: qrCode.qr + (qrCode?.appendInvoiceNo === true ? obj.invoiceNo : ""),
  //         foreground: qrCode.foreground,
  //         background: qrCode.background,
  //         alignment: "left",
  //         fit: 130,
  //         eccLevel: qrCode.eccLevel,
  //       });
  //     }
  //     var docDefinition = {
  //       pageSize: pageSize,
  //       pageOrientation: pageOrientation,
  //       watermark: {
  //         text: watermark.text,
  //         color: backgroundColor,
  //         opacity: Number(watermark.opacity),
  //         bold: watermark.bold,
  //         italics: watermark.italics,
  //       },
  //       info: {
  //         title: "Invoice No#" + obj.invoiceNo,
  //         author: "Invoice Generator",
  //         subject: "Invoice No#" + obj.invoiceNo,
  //         keywords: "Invoice No#" + obj.invoiceNo,
  //       },
  //       footer: function (currentPage, pageCount, pageSize) {
  //         return {
  //           text: `${reportDate} : Page ${currentPage.toString()} of ${pageCount.toString()}`,
  //           alignment: "center",
  //           fontSize: 8,
  //         };
  //       },
  //       header: function (currentPage, pageCount, pageSize) {
  //         return [
  //           {
  //             canvas: [
  //               {
  //                 type: "rect",
  //                 x: 0,
  //                 y: 10,
  //                 w: pageSize.width,
  //                 h: 3,
  //                 color: backgroundColor,
  //               },
  //             ],
  //           },
  //         ];
  //       },
  //       content: [
  //         {
  //           columns: [
  //             {
  //               width: "*",
  //               text: [
  //                 {
  //                   text: obj.invoiceFrom,
  //                 },
  //               ],
  //             },
  //             {
  //               width: "auto",
  //               columns: [
  //                 {
  //                   image: obj.imgSrc
  //                     ? obj.imgSrc
  //                     : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  //                   width: 100,
  //                   height: 100,
  //                 },
  //               ],
  //             },
  //             {
  //               text: [
  //                 {
  //                   text: obj.invoiceTo,
  //                   alignment: "right",
  //                 },
  //               ],
  //             },
  //           ],
  //         },

  //         {
  //           columns: [
  //             {
  //               width: "*",
  //               text: [
  //                 {
  //                   text: `${obj.title} #${obj.invoiceNo}`,
  //                   fontSize: 15,
  //                   bold: true,
  //                   lineHeight: 1.2,
  //                 },
  //               ],
  //             },
  //             {
  //               text: "Invoice Date: " + obj.invoiceDate,
  //               alignment: "right",
  //             },
  //             {
  //               text: "Due Date: " + obj.dueDate,
  //               alignment: "right",
  //             },
  //           ],
  //         },

  //         "\n",
  //         {
  //           margin: [0, 0, 0, 0],
  //           layout: "exampleLayout",
  //           dontBreakRows: true,
  //           table: {
  //             headerRows: 1,
  //             widths: ["auto", "*", 50, 60, 30, 80],
  //             // keepWithHeaderRows: 1,
  //             body: itemBody,
  //           },
  //         },

  //         {
  //           columns: [
  //             {
  //               width: "*",
  //               stack: qrArr,
  //             },
  //             {
  //               width: "auto",
  //               columns: [
  //                 {
  //                   layout: "totalLayout",
  //                   table: {
  //                     // headers are automatically repeated if the table spans over multiple pages
  //                     // you can declare how many rows should be treated as headers
  //                     headerRows: 0,
  //                     widths: ["*", 80],

  //                     body: [
  //                       [
  //                         { text: "Subtotal", bold: true, alignment: "right" },
  //                         {
  //                           text: this.getSubtotal(obj.items),
  //                           bold: false,
  //                           alignment: "right",
  //                         },
  //                       ],
  //                       [
  //                         { text: "Discounts", bold: true, alignment: "right" },
  //                         {
  //                           text:
  //                             obj.discounts > 0
  //                               ? "-" + obj.discounts
  //                               : obj.discounts,
  //                           bold: false,
  //                           alignment: "right",
  //                         },
  //                       ],
  //                       [
  //                         { text: "Shipping", bold: true, alignment: "right" },
  //                         {
  //                           text: obj.shipping,
  //                           bold: false,
  //                           alignment: "right",
  //                         },
  //                       ],
  //                       [
  //                         {
  //                           text: "Total (" + (obj.currency || "USD") + ")",
  //                           bold: true,
  //                           alignment: "right",
  //                         },
  //                         {
  //                           text: this.getTotal(
  //                             obj.items,
  //                             obj.discounts,
  //                             obj.shipping
  //                           ),
  //                           bold: false,
  //                           alignment: "right",
  //                         },
  //                       ],
  //                     ],
  //                   },
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //         {
  //           stack: [
  //             {
  //               text:
  //                 obj.terms !== "" ? "\nTerms & Conditions\n" + obj.terms : "",
  //               fontSize: 10,
  //             },
  //             "\n\n\n\n",
  //             {
  //               canvas: [
  //                 {
  //                   type: "line",
  //                   x1: 0,
  //                   y1: 5,
  //                   x2: 250,
  //                   y2: 5,
  //                   lineWidth: 1,
  //                 },
  //               ],
  //             },
  //             { text: "Signature / Stamp", color: backgroundColor },
  //             { text: "Place: " },
  //             { text: "Date: " },
  //           ],
  //         },
  //       ],
  //       styles: {
  //         header: {
  //           fontSize: 18,
  //           bold: true,
  //           margin: [0, 0, 0, 10],
  //         },
  //         subheader: {
  //           fontSize: 16,
  //           bold: true,
  //           margin: [0, 10, 0, 5],
  //         },
  //         tableExample: {
  //           margin: [0, 5, 0, 15],
  //         },
  //         tableHeader: {
  //           bold: true,
  //           fontSize: 13,
  //           color: "black",
  //         },
  //       },
  //       defaultStyle: {
  //         columnGap: 15,
  //       },
  //     };

  //     return docDefinition;
  //   };

  //   // Template 5
  //   static generateDocDefTemplate5 = (obj) => {
  //     const {
  //       backgroundColor,
  //       watermark,
  //       pageSize,
  //       pageOrientation,
  //       qrCodeActive,
  //       qrCode,
  //     } = this.docDefinition;
  //     let itemBody = [
  //       [
  //         { text: "#", style: "tableHeader" },
  //         { text: "Item", style: "tableHeader" },
  //         { text: "Qty", style: "tableHeader", alignment: "center" },
  //         { text: "Rate", style: "tableHeader", alignment: "right" },
  //         {
  //           text: obj?.taxation ?? "GST",
  //           style: "tableHeader",
  //           alignment: "center",
  //         },
  //         { text: "Amount", style: "tableHeader", alignment: "right" },
  //       ],
  //     ];
  //     let itemArr = ["", "", "", "", "", ""];
  //     if (obj.items.length === 0) itemBody.push(itemArr);
  //     for (let index = 0; index < obj.items.length; index++) {
  //       const element = obj.items[index];
  //       itemBody.push([
  //         index + 1,
  //         element.title,
  //         { text: element.quantity, alignment: "center" },
  //         { text: element.rate, alignment: "right" },
  //         { text: element.taxationPer, alignment: "center" },
  //         { text: element.amount, alignment: "right" },
  //       ]);
  //     }
  //     let subTotalArr = [
  //       {
  //         width: "*",
  //         columns: [
  //           {
  //             width: "*",
  //             text: [
  //               {
  //                 text: "Subtotal",
  //                 alignment: "right",
  //                 lineHeight: 1.2,
  //               },
  //               "\n",
  //               {
  //                 text: "Discounts",
  //                 alignment: "right",
  //                 lineHeight: 1.2,
  //               },
  //               "\n",
  //               {
  //                 text: "Shipping",
  //                 alignment: "right",
  //                 lineHeight: 1.2,
  //               },
  //               "\n",
  //               {
  //                 canvas: [
  //                   {
  //                     type: "line",
  //                     x1: 0,
  //                     y1: 5,
  //                     x2: 250,
  //                     y2: 5,
  //                     lineWidth: 3,
  //                   },
  //                 ],
  //               },
  //               {
  //                 text: "Total (" + (obj.currency || "USD") + ")",
  //                 fontSize: 12,
  //                 bold: true,
  //                 alignment: "right",
  //               },
  //             ],
  //           },
  //           {
  //             width: "auto",
  //             text: [
  //               {
  //                 text: this.getSubtotal(obj.items),
  //                 alignment: "right",
  //                 lineHeight: 1.2,
  //               },
  //               "\n",
  //               {
  //                 text: obj.discounts > 0 ? "-" + obj.discounts : obj.discounts,
  //                 alignment: "right",
  //                 lineHeight: 1.2,
  //               },
  //               "\n",
  //               {
  //                 text: obj.shipping,
  //                 alignment: "right",
  //                 lineHeight: 1.2,
  //               },
  //               "\n",
  //               {
  //                 text: this.getTotal(obj.items, obj.discounts, obj.shipping),
  //                 fontSize: 12,
  //                 bold: true,
  //                 alignment: "right",
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //     ];
  //     if (qrCodeActive && (qrCode?.qr || qrCode?.appendInvoiceNo)) {
  //       subTotalArr.push("\n\n");
  //       subTotalArr.push({
  //         qr: qrCode.qr + (qrCode?.appendInvoiceNo === true ? obj.invoiceNo : ""),
  //         foreground: qrCode.foreground,
  //         background: qrCode.background,
  //         alignment: "right",
  //         fit: 130,
  //         eccLevel: qrCode.eccLevel,
  //       });
  //     }
  //     var docDefinition = {
  //       pageSize: pageSize,
  //       pageOrientation: pageOrientation,
  //       watermark: {
  //         text: watermark.text,
  //         color: backgroundColor,
  //         opacity: Number(watermark.opacity),
  //         bold: watermark.bold,
  //         italics: watermark.italics,
  //       },
  //       info: {
  //         title: "Invoice No#" + obj.invoiceNo,
  //         author: "Invoice Generator",
  //         subject: "Invoice No#" + obj.invoiceNo,
  //         keywords: "Invoice No#" + obj.invoiceNo,
  //       },
  //       footer: function (currentPage, pageCount, pageSize) {
  //         return [
  //           {
  //             canvas: [
  //               {
  //                 type: "rect",
  //                 x: 0,
  //                 y: 0,
  //                 w: pageSize.width,
  //                 h: 5,
  //                 color: backgroundColor,
  //               },
  //             ],
  //           },
  //           {
  //             table: {
  //               widths: ["80%", "20%"],
  //               body: [
  //                 [
  //                   {
  //                     text: obj.footNote,
  //                     alignment: "left",
  //                     fontSize: 7,
  //                     margin: [40, 0, 0, 0],
  //                   },
  //                   {
  //                     text:
  //                       "Page " +
  //                       currentPage.toString() +
  //                       " of " +
  //                       pageCount +
  //                       "   ",
  //                     alignment: "right",
  //                     margin: [0, 10, 40, 0],
  //                   },
  //                 ],
  //               ],
  //             },
  //             layout: "noBorders",
  //           },
  //         ];
  //       },
  //       pageMargins: [40, 85, 40, 40],
  //       header: function (currentPage, pageCount, pageSize) {
  //         return [
  //           {
  //             table: {
  //               widths: ["50%", "50%"],
  //               body: [
  //                 [
  //                   {
  //                     image: obj.imgSrc
  //                       ? obj.imgSrc
  //                       : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  //                     width: 70,
  //                     height: 50,
  //                     margin: [40, 10, 0, 0],
  //                   },
  //                   {
  //                     margin: [40, 10, 40, 0],
  //                     text: [
  //                       {
  //                         text: `${obj.title} #${obj.invoiceNo}`,
  //                         fontSize: 15,
  //                         bold: true,
  //                         alignment: "right",
  //                         lineHeight: 1.2,
  //                       },
  //                       "\n",
  //                       {
  //                         text: "Invoice Date: " + obj.invoiceDate,
  //                         alignment: "right",
  //                       },
  //                       "\n",
  //                       {
  //                         text: "Due Date: " + obj.dueDate,
  //                         alignment: "right",
  //                       },
  //                     ],
  //                   },
  //                 ],
  //               ],
  //             },
  //             layout: "noBorders",
  //           },
  //           {
  //             canvas: [
  //               {
  //                 type: "rect",
  //                 x: 0,
  //                 y: 0,
  //                 w: pageSize.width,
  //                 h: 5,
  //                 color: backgroundColor,
  //               },
  //             ],
  //           },
  //         ];
  //       },
  //       content: [
  //         {
  //           style: "tableExample",
  //           table: {
  //             headerRows: 1,
  //             widths: ["auto", "*"],
  //             // dontBreakRows: true,
  //             // keepWithHeaderRows: 1,
  //             body: [
  //               [
  //                 { text: "Bill From", style: "tableHeader" },
  //                 { text: "Bill For", style: "tableHeader" },
  //               ],
  //               [obj.invoiceFrom, obj.invoiceTo],
  //             ],
  //           },
  //           layout: {
  //             fillColor: function (rowIndex, node, columnIndex) {
  //               return rowIndex === 0 ? "#CCCCCC" : null;
  //             },
  //           },
  //         },
  //         {
  //           style: "tableExample",
  //           table: {
  //             headerRows: 1,
  //             widths: ["auto", "*", 50, 60, 30, 80],
  //             // keepWithHeaderRows: 1,
  //             body: itemBody,
  //           },
  //           layout: "lightHorizontalLines",
  //         },
  //         {
  //           columns: [
  //             {
  //               width: "70%",
  //               text: [
  //                 {
  //                   text:
  //                     obj.terms !== "" ? "Terms & Conditions\n" + obj.terms : "",
  //                   fontSize: 10,
  //                 },
  //               ],
  //             },
  //             subTotalArr,
  //           ],
  //         },
  //       ],
  //       styles: {
  //         header: {
  //           fontSize: 18,
  //           bold: true,
  //           margin: [0, 0, 0, 10],
  //         },
  //         subheader: {
  //           fontSize: 16,
  //           bold: true,
  //           margin: [0, 10, 0, 5],
  //         },
  //         tableExample: {
  //           margin: [0, 5, 0, 15],
  //         },
  //         tableHeader: {
  //           bold: true,
  //           fontSize: 13,
  //           color: "black",
  //         },
  //       },
  //       defaultStyle: {
  //         columnGap: 15,
  //       },
  //     };

  //     return docDefinition;
  //   };

  //   // Template 6
  //   static generateDocDefTemplate6 = (obj) => {
  //     const {
  //       backgroundColor,
  //       watermark,
  //       pageSize,
  //       pageOrientation,
  //       qrCodeActive,
  //       qrCode,
  //     } = this.docDefinition;
  //     let itemBody = [
  //       [
  //         { text: "#", style: "tableHeader" },
  //         { text: "Item", style: "tableHeader" },
  //         { text: "Qty", style: "tableHeader", alignment: "center" },
  //         { text: "Rate", style: "tableHeader", alignment: "right" },
  //         {
  //           text: obj?.taxation ?? "GST",
  //           style: "tableHeader",
  //           alignment: "center",
  //         },
  //         { text: "Amount", style: "tableHeader", alignment: "right" },
  //       ],
  //     ];
  //     let itemArr = ["", "", "", "", "", ""];
  //     if (obj.items.length === 0) itemBody.push(itemArr);
  //     for (let index = 0; index < obj.items.length; index++) {
  //       const element = obj.items[index];
  //       itemBody.push([
  //         index + 1,
  //         element.title,
  //         { text: element.quantity, alignment: "center" },
  //         { text: element.rate, alignment: "right" },
  //         { text: element.taxationPer, alignment: "center" },
  //         { text: element.amount, alignment: "right" },
  //       ]);
  //     }
  //     let subTotalArr = [
  //       {
  //         width: "*",
  //         columns: [
  //           {
  //             width: "*",
  //             text: [
  //               {
  //                 text: "Subtotal",
  //                 alignment: "right",
  //                 lineHeight: 1.2,
  //               },
  //               "\n",
  //               {
  //                 text: "Discounts",
  //                 alignment: "right",
  //                 lineHeight: 1.2,
  //               },
  //               "\n",
  //               {
  //                 text: "Shipping",
  //                 alignment: "right",
  //                 lineHeight: 1.2,
  //               },
  //               "\n",
  //               {
  //                 canvas: [
  //                   {
  //                     type: "line",
  //                     x1: 0,
  //                     y1: 5,
  //                     x2: 250,
  //                     y2: 5,
  //                     lineWidth: 3,
  //                   },
  //                 ],
  //               },
  //               {
  //                 text: "Total (" + (obj.currency || "USD") + ")",
  //                 fontSize: 12,
  //                 bold: true,
  //                 alignment: "right",
  //               },
  //             ],
  //           },
  //           {
  //             width: "auto",
  //             text: [
  //               {
  //                 text: this.getSubtotal(obj.items),
  //                 alignment: "right",
  //                 lineHeight: 1.2,
  //               },
  //               "\n",
  //               {
  //                 text: obj.discounts > 0 ? "-" + obj.discounts : obj.discounts,
  //                 alignment: "right",
  //                 lineHeight: 1.2,
  //               },
  //               "\n",
  //               {
  //                 text: obj.shipping,
  //                 alignment: "right",
  //                 lineHeight: 1.2,
  //               },
  //               "\n",
  //               {
  //                 text: this.getTotal(obj.items, obj.discounts, obj.shipping),
  //                 fontSize: 12,
  //                 bold: true,
  //                 alignment: "right",
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //     ];
  //     if (qrCodeActive && (qrCode?.qr || qrCode?.appendInvoiceNo)) {
  //       subTotalArr.push("\n\n");
  //       subTotalArr.push({
  //         qr: qrCode.qr + (qrCode?.appendInvoiceNo === true ? obj.invoiceNo : ""),
  //         foreground: qrCode.foreground,
  //         background: qrCode.background,
  //         alignment: "right",
  //         fit: 130,
  //         eccLevel: qrCode.eccLevel,
  //       });
  //     }
  //     pdfMake.tableLayouts = {
  //       exampleLayout: {
  //         hLineWidth: function (i, node) {
  //           if (i === 0 || i === node.table.body.length) {
  //             return 0;
  //           }
  //           return i === node.table.headerRows ? 2 : 1;
  //         },
  //         vLineWidth: function (i) {
  //           return 0;
  //         },
  //         hLineColor: function (i, node) {
  //           return i === 1 ? "black" : "#aaa";
  //         },
  //         fillColor: function (i, node) {
  //           return i === 0 ? backgroundColor : i % 2 === 0 ? "#CCCCCC" : null;
  //         },
  //         paddingLeft: function (i) {
  //           return i === 0 ? 8 : 8;
  //         },
  //         paddingRight: function (i, node) {
  //           //return i === node.table.widths.length - 1 ? 0 : 8;
  //           return 3;
  //         },
  //         paddingTop: function (i, node) {
  //           return 3;
  //         },
  //         paddingBottom: function (i, node) {
  //           return 3;
  //         },
  //       },
  //     };
  //     var docDefinition = {
  //       pageSize: pageSize,
  //       pageOrientation: pageOrientation,
  //       watermark: {
  //         text: watermark.text,
  //         color: backgroundColor,
  //         opacity: Number(watermark.opacity),
  //         bold: watermark.bold,
  //         italics: watermark.italics,
  //       },
  //       info: {
  //         title: "Invoice No#" + obj.invoiceNo,
  //         author: "Invoice Generator",
  //         subject: "Invoice No#" + obj.invoiceNo,
  //         keywords: "Invoice No#" + obj.invoiceNo,
  //       },
  //       footer: function (currentPage, pageCount, pageSize) {
  //         return [
  //           {
  //             canvas: [
  //               {
  //                 type: "rect",
  //                 x: 0,
  //                 y: 0,
  //                 w: pageSize.width,
  //                 h: 5,
  //                 color: backgroundColor,
  //               },
  //             ],
  //           },
  //           {
  //             table: {
  //               widths: ["80%", "20%"],
  //               body: [
  //                 [
  //                   {
  //                     text: obj.footNote,
  //                     alignment: "left",
  //                     fontSize: 7,
  //                     margin: [40, 0, 0, 0],
  //                   },
  //                   {
  //                     text:
  //                       "Page " +
  //                       currentPage.toString() +
  //                       " of " +
  //                       pageCount +
  //                       "   ",
  //                     alignment: "right",
  //                     margin: [0, 10, 40, 0],
  //                   },
  //                 ],
  //               ],
  //             },
  //             layout: "noBorders",
  //           },
  //         ];
  //       },
  //       pageMargins: [40, 85, 40, 40],
  //       header: function (currentPage, pageCount, pageSize) {
  //         return [
  //           {
  //             table: {
  //               widths: ["20%", "40%", "40%"],
  //               body: [
  //                 [
  //                   {
  //                     image: obj.imgSrc
  //                       ? obj.imgSrc
  //                       : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  //                     width: 70,
  //                     height: 50,
  //                     margin: [40, 10, 0, 0],
  //                   },
  //                   {
  //                     margin: [10, 10, 10, 0],
  //                     text: obj.invoiceFrom,
  //                     fontSize: 10,
  //                   },
  //                   {
  //                     margin: [10, 10, 10, 0],
  //                     text: obj.invoiceTo,
  //                     fontSize: 10,
  //                     bold: true,
  //                   },
  //                 ],
  //               ],
  //             },
  //             layout: "noBorders",
  //           },
  //           {
  //             canvas: [
  //               {
  //                 type: "rect",
  //                 x: 0,
  //                 y: 0,
  //                 w: pageSize.width,
  //                 h: 5,
  //                 color: backgroundColor,
  //               },
  //             ],
  //           },
  //         ];
  //       },
  //       content: [
  //         {
  //           columns: [
  //             {
  //               width: "*",
  //               text: [
  //                 {
  //                   text: `${obj.title} #${obj.invoiceNo}`,
  //                   fontSize: 15,
  //                   bold: true,
  //                   lineHeight: 1.2,
  //                 },
  //               ],
  //             },
  //             {
  //               text: "Invoice Date: " + obj.invoiceDate,
  //               alignment: "right",
  //             },
  //             {
  //               text: "Due Date: " + obj.dueDate,
  //               alignment: "right",
  //               decoration: "underline",
  //             },
  //           ],
  //         },
  //         {
  //           style: "tableExample",
  //           table: {
  //             headerRows: 1,
  //             widths: ["auto", "*", 50, 60, 30, 80],
  //             // keepWithHeaderRows: 1,
  //             body: itemBody,
  //           },
  //           layout: "exampleLayout",
  //         },
  //         {
  //           columns: [
  //             {
  //               width: "70%",
  //               text: [
  //                 {
  //                   text:
  //                     obj.terms !== "" ? "Terms & Conditions\n" + obj.terms : "",
  //                   fontSize: 10,
  //                 },
  //               ],
  //             },
  //             subTotalArr,
  //           ],
  //         },
  //       ],
  //       styles: {
  //         header: {
  //           fontSize: 18,
  //           bold: true,
  //           margin: [0, 0, 0, 10],
  //         },
  //         subheader: {
  //           fontSize: 16,
  //           bold: true,
  //           margin: [0, 10, 0, 5],
  //         },
  //         tableExample: {
  //           margin: [0, 5, 0, 15],
  //         },
  //         tableHeader: {
  //           bold: true,
  //           fontSize: 13,
  //           color: "white",
  //         },
  //       },
  //       defaultStyle: {
  //         columnGap: 15,
  //       },
  //     };
  //     return docDefinition;
  //   };

  //   // template -----------------------------
}

export default pdfExport;
