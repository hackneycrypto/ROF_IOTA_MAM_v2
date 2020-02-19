var express = require('express');
var bodyParser = require('body-parser');
const config = require('./config');
var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false })


// Serve Static Assets
app.use(express.static('public'));
// Virtual Path Prefix '/static'
app.use('/static', express.static('public'))
app.get('/Order_COL0001', function(req, res) {
  res.sendFile(__dirname + "/pages/" + "COL0001_1234.html");
});
app.get('/Order_COL0001a', function(req, res) {
  res.sendFile(__dirname + "/pages/" + "COL0001_1.html");
});
app.get('/Order_SXA0001', function(req, res) {
  res.sendFile(__dirname + "/pages/" + "SXA0001_123.html");
});
app.get('/Order_ARU0001', function(req, res) {
  res.sendFile(__dirname + "/pages/" + "ARU0001_123.html");
});
app.get('/Order_ACP0001', function(req, res) {
  res.sendFile(__dirname + "/pages/" + "ACP0001_123.html");
});
app.get('/Order_ONO0001', function(req, res) {
  res.sendFile(__dirname + "/pages/" + "ONO0001_123.html");
});
app.get('/Order_LAG0001', function(req, res) {
  res.sendFile(__dirname + "/pages/" + "LAG0001_123.html");
});
app.get('/Order_COO0001', function(req, res) {
  res.sendFile(__dirname + "/pages/" + "COO0001_123.html");
});

// ********** POST ROUTES FOR MULTIPLE TRANSACTION UPDATES ********** //

// ********** PERMANODE LIVENET ********** //

// MAM post route for ordLAG0001.html (Initiate Order, Confirm Items (9 / 1 community), Confirm Items Completed) 
app.post('/LAG0001_123', urlencodedParser, function(req, res){
  const Mam = require('@iota/mam')
  const { asciiToTrytes, trytesToAscii } = require('@iota/converter')
  
  // Dev
  const provider = 'https://nodes.devnet.iota.org'
  const mamExplorerLink = 'https://devnet.thetangle.org/mam/'
  
  // Live
  // const provider = config.provider
  // const provider = 'https://nodes.thetangle.org:443'
  // const mamExplorerLink = 'https://thetangle.org/mam/'

  // Update to change number of resItems from Excel HTML Template
  // Dates respond to number of communities, resItems to number of Items in Order
  response = {
    resSeed: req.body.seed, 
    resOrderNo: req.body.reqOrderNo,
    resStatusROF: req.body.statusROF, resStatusArt: req.body.statusArt, resStatusBrand: req.body.statusBrand, resStatusROFReceived: req.body.statusROFReceived,
    resVerByROF: req.body.verByROF, resVerByBrand: req.body.verByBrand,
    resLocROF: req.body.locROF, resLocBrand: req.body.locBrand,
    resItem1: req.body.item1, resQuant1: req.body.quant1, resArt1: req.body.art1, resCom1: req.body.com1,
    resItem2: req.body.item2, resQuant2: req.body.quant2, resArt2: req.body.art2, resCom2: req.body.com2,
    resItem3: req.body.item3, resQuant3: req.body.quant3, resArt3: req.body.art3, resCom3: req.body.com3,
    resItem4: req.body.item4, resQuant4: req.body.quant4, resArt4: req.body.art4, resCom4: req.body.com4,
    resItem5: req.body.item5, resQuant5: req.body.quant5, resArt5: req.body.art5, resCom5: req.body.com5,
    resItem6: req.body.item6, resQuant6: req.body.quant6, resArt6: req.body.art6, resCom6: req.body.com6,
    resItem7: req.body.item7, resQuant7: req.body.quant7, resArt7: req.body.art7, resCom7: req.body.com7,
    resItem8: req.body.item8, resQuant8: req.body.quant8, resArt8: req.body.art8, resCom8: req.body.com8,
    resItem9: req.body.item9, resQuant9: req.body.quant9, resArt9: req.body.art9, resCom9: req.body.com9,
    resMonth1: new Date(req.body.date1).getMonth()+1, resDay1: new Date(req.body.date1).getDate(), resYear1: new Date(req.body.date1).getFullYear(),
  };
  console.log('Publishing LAG0001 Records...!');

  const seed = response.seed;
  console.log('HTML Seed: ', seed)
  let mamState = Mam.init(provider)
  // let mamState = Mam.init(provider, seed)
  console.log('mamState: ', mamState); 

  // Publish to tangle
  const publish = async packet => {
    // Create MAM Payload - STRING OF TRYTES
    const trytes = asciiToTrytes(JSON.stringify(packet))
    const message = Mam.create(mamState, trytes)
  
    // Save new mamState
    mamState = message.state

    // Attach the payload (comment out as appropriate)
    // await Mam.attach(message.payload, message.address, 3, 14) // live    
    await Mam.attach(message.payload, message.address, 3, 9) // devnet

    console.log('Published', packet, '\n');
    return message.root
  }
  
  const publishAll = async () => {    
    const root = await publish({
      status: response.resStatusROF+" "+response.resOrderNo+" by "+response.resVerByROF+", "+response.resLocROF,
      verification: response.resVerByROF+", "+response.resLocROF+" at 10/10/2019, 10:00:54 AM"
    });
    // FOR LAG enter as 15/12/2019
    await publish({
      status: response.resStatusArt+": "+response.resItem1+" (Quantity "+response.resQuant1+") by "+response.resArt1+", "+response.resCom1,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem2+" (Quantity "+response.resQuant2+") by "+response.resArt2+", "+response.resCom2,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem3+" (Quantity "+response.resQuant3+") by "+response.resArt3+", "+response.resCom3,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem4+" (Quantity "+response.resQuant4+") by "+response.resArt4+", "+response.resCom4,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem5+" (Quantity "+response.resQuant5+") by "+response.resArt5+", "+response.resCom5,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem6+" (Quantity "+response.resQuant6+") by "+response.resArt6+", "+response.resCom6,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem7+" (Quantity "+response.resQuant7+") by "+response.resArt7+", "+response.resCom7,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem8+" (Quantity "+response.resQuant8+") by "+response.resArt8+", "+response.resCom8,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem9+" (Quantity "+response.resQuant9+") by "+response.resArt9+", "+response.resCom9,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });    // Brand Order Finalised SS1
    await publish({
      status: response.resStatusBrand+" "+response.resOrderNo+" by "+response.resVerByBrand+", "+response.resLocBrand,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at 12/20/2019, 06:22:12 PM",
    });
        // ROF Finalise (as items already arrived)
    await publish({
      status: response.resStatusROFReceived+" "+response.resOrderNo+" by "+response.resVerByROF+", "+response.resLocROF,
      verification: response.resVerByROF+", "+response.resLocROF+" at 01/09/2020, 09:15:07 PM"
    });

    return root
    }
  
  // Callback used to pass data out of the fetch
  const logData = data => console.log('Fetched and parsed', JSON.parse(trytesToAscii(data)), '\n')
  
  publishAll()
    .then(async root => {
  
      // Output asyncronously using "logData" callback function
      await Mam.fetch(root, 'public', null, logData)
  
      // Output syncronously once fetch is completed
      const result = await Mam.fetch(root, 'public')
      result.messages.forEach(message => console.log('Fetched and parsed', JSON.parse(trytesToAscii(message)), '\n'))
  
      console.log(`Verify with MAM Explorer:\n${mamExplorerLink}${root}\n`);
    })
    //convert the response in JSON formatand pass to the display on /MAM2 response page
    //   res.end('All records for the Artisans and the Brand have been successfully added. Thank you!'); 
    res.sendFile(__dirname + "/pages/" + "UpdateCompleted.html");  
  });  

// MAM post route for ordCOO0001.html (Initiate Order, Confirm Items (16 / 1 community), Confirm Items Completed) 
app.post('/COO0001_123', urlencodedParser, function(req, res){
  const Mam = require('@iota/mam')
  const { asciiToTrytes, trytesToAscii } = require('@iota/converter')
  
  // Dev
  const provider = 'https://nodes.devnet.iota.org'
  const mamExplorerLink = 'https://devnet.thetangle.org/mam/'
  
  // Live
  // const provider = config.provider
  // const provider = 'https://nodes.thetangle.org:443'
  // const mamExplorerLink = 'https://thetangle.org/mam/'

  // Update to change number of resItems from Excel HTML Template
  // Dates respond to number of communities, resItems to number of Items in Order
  response = {
    resSeed: req.body.seed, 
    resOrderNo: req.body.reqOrderNo,
    resStatusROF: req.body.statusROF, resStatusArt: req.body.statusArt, resStatusBrand: req.body.statusBrand, resStatusROFReceived: req.body.statusROFReceived,
    resVerByROF: req.body.verByROF, resVerByBrand: req.body.verByBrand,
    resLocROF: req.body.locROF, resLocBrand: req.body.locBrand,
    resItem1: req.body.item1, resQuant1: req.body.quant1, resArt1: req.body.art1, resCom1: req.body.com1,
    resItem2: req.body.item2, resQuant2: req.body.quant2, resArt2: req.body.art2, resCom2: req.body.com2,
    resItem3: req.body.item3, resQuant3: req.body.quant3, resArt3: req.body.art3, resCom3: req.body.com3,
    resItem4: req.body.item4, resQuant4: req.body.quant4, resArt4: req.body.art4, resCom4: req.body.com4,
    resItem5: req.body.item5, resQuant5: req.body.quant5, resArt5: req.body.art5, resCom5: req.body.com5,
    resItem6: req.body.item6, resQuant6: req.body.quant6, resArt6: req.body.art6, resCom6: req.body.com6,
    resItem7: req.body.item7, resQuant7: req.body.quant7, resArt7: req.body.art7, resCom7: req.body.com7,
    resItem8: req.body.item8, resQuant8: req.body.quant8, resArt8: req.body.art8, resCom8: req.body.com8,
    resItem9: req.body.item9, resQuant9: req.body.quant9, resArt9: req.body.art9, resCom9: req.body.com9,
    resItem10: req.body.item9, resQuant10: req.body.quant9, resArt10: req.body.art9, resCom10: req.body.com9,
    resItem9: req.body.item9, resQuant9: req.body.quant9, resArt9: req.body.art9, resCom9: req.body.com9,
    resItem10: req.body.item10, resQuant10: req.body.quant10, resArt10: req.body.art10, resCom10: req.body.com10,
    resItem11: req.body.item11, resQuant11: req.body.quant11, resArt11: req.body.art11, resCom11: req.body.com11,
    resItem12: req.body.item12, resQuant12: req.body.quant12, resArt12: req.body.art12, resCom12: req.body.com12,
    resItem13: req.body.item13, resQuant13: req.body.quant13, resArt13: req.body.art13, resCom13: req.body.com13,
    resItem14: req.body.item14, resQuant14: req.body.quant14, resArt14: req.body.art14, resCom14: req.body.com14,
    resItem15: req.body.item15, resQuant15: req.body.quant15, resArt15: req.body.art15, resCom15: req.body.com15,
    resItem16: req.body.item16, resQuant16: req.body.quant16, resArt16: req.body.art16, resCom16: req.body.com16,
    resMonth1: new Date(req.body.date1).getMonth()+1, resDay1: new Date(req.body.date1).getDate(), resYear1: new Date(req.body.date1).getFullYear(),
  };
  console.log('Publishing COO0001 Records...!');

  const seed = response.seed;
  console.log('HTML Seed: ', seed)
  let mamState = Mam.init(provider)
  // let mamState = Mam.init(provider, seed)
  console.log('mamState: ', mamState); 

  // Publish to tangle
  const publish = async packet => {
    // Create MAM Payload - STRING OF TRYTES
    const trytes = asciiToTrytes(JSON.stringify(packet))
    const message = Mam.create(mamState, trytes)
  
    // Save new mamState
    mamState = message.state

    // Attach the payload (comment out as appropriate)
    // await Mam.attach(message.payload, message.address, 3, 14) // live    
    await Mam.attach(message.payload, message.address, 3, 9) // devnet

    console.log('Published', packet, '\n');
    return message.root
  }
  
  const publishAll = async () => {    
    const root = await publish({
      status: response.resStatusROF+" "+response.resOrderNo+" by "+response.resVerByROF+", "+response.resLocROF,
      verification: response.resVerByROF+", "+response.resLocROF+" at 10/10/2019, 10:00:54 AM"
    });
    // FOR LAG enter as 15/12/2019
    await publish({
      status: response.resStatusArt+": "+response.resItem1+" (Quantity "+response.resQuant1+") by "+response.resArt1+", "+response.resCom1,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem2+" (Quantity "+response.resQuant2+") by "+response.resArt2+", "+response.resCom2,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem3+" (Quantity "+response.resQuant3+") by "+response.resArt3+", "+response.resCom3,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem4+" (Quantity "+response.resQuant4+") by "+response.resArt4+", "+response.resCom4,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem5+" (Quantity "+response.resQuant5+") by "+response.resArt5+", "+response.resCom5,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem6+" (Quantity "+response.resQuant6+") by "+response.resArt6+", "+response.resCom6,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem7+" (Quantity "+response.resQuant7+") by "+response.resArt7+", "+response.resCom7,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem8+" (Quantity "+response.resQuant8+") by "+response.resArt8+", "+response.resCom8,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem9+" (Quantity "+response.resQuant9+") by "+response.resArt9+", "+response.resCom9,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      }); 
      await publish({
        status: response.resStatusArt+": "+response.resItem10+" (Quantity "+response.resQuant10+") by "+response.resArt10+", "+response.resCom10,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resDay1+"/"+response.resMonth1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem11+" (Quantity "+response.resQuant11+") by "+response.resArt11+", "+response.resCom11,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resDay1+"/"+response.resMonth1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem12+" (Quantity "+response.resQuant12+") by "+response.resArt12+", "+response.resCom12,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resDay1+"/"+response.resMonth1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem13+" (Quantity "+response.resQuant13+") by "+response.resArt13+", "+response.resCom13,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resDay1+"/"+response.resMonth1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem14+" (Quantity "+response.resQuant14+") by "+response.resArt14+", "+response.resCom14,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resDay1+"/"+response.resMonth1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem15+" (Quantity "+response.resQuant15+") by "+response.resArt15+", "+response.resCom15,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resDay1+"/"+response.resMonth1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem16+" (Quantity "+response.resQuant16+") by "+response.resArt16+", "+response.resCom16,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resDay1+"/"+response.resMonth1+"/"+response.resYear1
        });   // Brand Order Finalised SS1
    await publish({
      status: response.resStatusBrand+" "+response.resOrderNo+" by "+response.resVerByBrand+", "+response.resLocBrand,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at 12/20/2019, 06:22:12 PM",
    });
        // ROF Finalise (as items already arrived)
    await publish({
      status: response.resStatusROFReceived+" "+response.resOrderNo+" by "+response.resVerByROF+", "+response.resLocROF,
      verification: response.resVerByROF+", "+response.resLocROF+" at 01/09/2020, 09:15:07 PM"
    });

    return root
    }
  
  // Callback used to pass data out of the fetch
  const logData = data => console.log('Fetched and parsed', JSON.parse(trytesToAscii(data)), '\n')
  
  publishAll()
    .then(async root => {
  
      // Output asyncronously using "logData" callback function
      await Mam.fetch(root, 'public', null, logData)
  
      // Output syncronously once fetch is completed
      const result = await Mam.fetch(root, 'public')
      result.messages.forEach(message => console.log('Fetched and parsed', JSON.parse(trytesToAscii(message)), '\n'))
  
      console.log(`Verify with MAM Explorer:\n${mamExplorerLink}${root}\n`);
    })
    //convert the response in JSON formatand pass to the display on /MAM2 response page
    //   res.end('All records for the Artisans and the Brand have been successfully added. Thank you!'); 
    res.sendFile(__dirname + "/pages/" + "UpdateCompleted.html");  
  }); 

// MAM post route for ordSXA0001.html (Initiate Order, Confirm Items (24 / 7 community), Confirm Items Completed)       
app.post('/ONO0001_123', urlencodedParser, function(req, res){
  const Mam = require('./mam.client.js/lib/mam.client.js')
  const { composeAPI } = require('@iota/core');
  const { asciiToTrytes, trytesToAscii } = require('@iota/converter')
  // const provider = 'https://nodes.devnet.iota.org'
  const iota = composeAPI({provider: config.provider});
  const mamExplorerLink = `https://thetangle.org/mam/`
  // const seed = 'LQUNUKSOHUAX9PP9JKVRKGQOWOWRJIJLMAYHWQSGAIEIVKMGG9VFJARFI9PYUQISYIMGRYQHOAMACQLTT'
  // var asyncLoop = require('node-async-loop');

  // Update to change number of resItems from Excel HTML Template
  // Dates respond to number of communities, resItems to number of Items in Order
  response = {
    resSeed: req.body.seed, 
    resOrderNo: req.body.reqOrderNo,
    resStatusROF: req.body.statusROF, resStatusArt: req.body.statusArt, resStatusBrand: req.body.statusBrand,
    resVerByROF: req.body.verByROF, resVerByBrand: req.body.verByBrand,
    resLocROF: req.body.locROF, resLocBrand: req.body.locBrand,
    resItem1: req.body.item1, resQuant1: req.body.quant1, resArt1: req.body.art1, resCom1: req.body.com1,
    resItem2: req.body.item2, resQuant2: req.body.quant2, resArt2: req.body.art2, resCom2: req.body.com2,
    resItem3: req.body.item3, resQuant3: req.body.quant3, resArt3: req.body.art3, resCom3: req.body.com3,
    resItem4: req.body.item4, resQuant4: req.body.quant4, resArt4: req.body.art4, resCom4: req.body.com4,
    resItem5: req.body.item5, resQuant5: req.body.quant5, resArt5: req.body.art5, resCom5: req.body.com5,
    resItem6: req.body.item6, resQuant6: req.body.quant6, resArt6: req.body.art6, resCom6: req.body.com6,
    resItem7: req.body.item7, resQuant7: req.body.quant7, resArt7: req.body.art7, resCom7: req.body.com7,
    resItem8: req.body.item8, resQuant8: req.body.quant8, resArt8: req.body.art8, resCom8: req.body.com8,
    resItem9: req.body.item9, resQuant9: req.body.quant9, resArt9: req.body.art9, resCom9: req.body.com9,
    resItem10: req.body.item10, resQuant10: req.body.quant10, resArt10: req.body.art10, resCom10: req.body.com10,
    resItem11: req.body.item11, resQuant11: req.body.quant11, resArt11: req.body.art11, resCom11: req.body.com11,
    resItem12: req.body.item12, resQuant12: req.body.quant12, resArt12: req.body.art12, resCom12: req.body.com12,
    resItem13: req.body.item13, resQuant13: req.body.quant13, resArt13: req.body.art13, resCom13: req.body.com13,
    resItem14: req.body.item14, resQuant14: req.body.quant14, resArt14: req.body.art14, resCom14: req.body.com14,
    resItem15: req.body.item15, resQuant15: req.body.quant15, resArt15: req.body.art15, resCom15: req.body.com15,
    resItem16: req.body.item16, resQuant16: req.body.quant16, resArt16: req.body.art16, resCom16: req.body.com16,
    resItem17: req.body.item17, resQuant17: req.body.quant17, resArt17: req.body.art17, resCom17: req.body.com17,
    resItem18: req.body.item18, resQuant18: req.body.quant18, resArt18: req.body.art18, resCom18: req.body.com18,
    resItem19: req.body.item19, resQuant19: req.body.quant19, resArt19: req.body.art19, resCom19: req.body.com19,
    resItem20: req.body.item20, resQuant20: req.body.quant20, resArt20: req.body.art20, resCom20: req.body.com20,
    resItem21: req.body.item21, resQuant21: req.body.quant21, resArt21: req.body.art21, resCom21: req.body.com21,
    resItem22: req.body.item22, resQuant22: req.body.quant22, resArt22: req.body.art22, resCom22: req.body.com22,
    resItem23: req.body.item23, resQuant23: req.body.quant23, resArt23: req.body.art23, resCom23: req.body.com23,
    resItem24: req.body.item24, resQuant24: req.body.quant24, resArt24: req.body.art24, resCom24: req.body.com24,
    resMonth1: new Date(req.body.date1).getMonth()+1, resDay1: new Date(req.body.date1).getDate(), resYear1: new Date(req.body.date1).getFullYear(),
    resMonth2: new Date(req.body.date2).getMonth()+1, resDay2: new Date(req.body.date2).getDate(), resYear2: new Date(req.body.date2).getFullYear(),
    resMonth3: new Date(req.body.date3).getMonth()+1, resDay3: new Date(req.body.date3).getDate(), resYear3: new Date(req.body.date3).getFullYear(),
    resMonth4: new Date(req.body.date4).getMonth()+1, resDay4: new Date(req.body.date4).getDate(), resYear4: new Date(req.body.date4).getFullYear(),
    resMonth5: new Date(req.body.date5).getMonth()+1, resDay5: new Date(req.body.date5).getDate(), resYear5: new Date(req.body.date5).getFullYear(),
    resMonth6: new Date(req.body.date6).getMonth()+1, resDay6: new Date(req.body.date6).getDate(), resYear6: new Date(req.body.date6).getFullYear(),
    resMonth7: new Date(req.body.date7).getMonth()+1, resDay7: new Date(req.body.date7).getDate(), resYear7: new Date(req.body.date7).getFullYear(),
};
console.log('Publishing ONO0001 Records...');
// console.log(response);

  const seed = response.seed;
  console.log('HTML Seed: ', seed);
  //let mamState = Mam.init(provider, seed)
  let mamState = Mam.init(config.provider, seed)
  console.log('mamState: ', mamState); 

  // Publish to tangle
  const publish = async packet => {
      // Create MAM Payload - STRING OF TRYTES
      const trytes = asciiToTrytes(JSON.stringify(packet))
      const message = Mam.create(mamState, trytes)
  
      // Save new mamState
      mamState = message.state
  
      // Attach the payload
      await Mam.attach(message.payload, message.address, 3, 14)
  
      console.log('Published', packet, '\n');
      return message.root
  }
  
  const publishAll = async () => {
    const root = await publish({
      status: response.resStatusROF+" "+response.resOrderNo+" by "+response.resVerByROF+", "+response.resLocROF,
      verification: response.resVerByROF+", "+response.resLocROF+" at 11/10/2019, 12:12:43 PM"
    });
    // Added early record in case crashes...
    console.log(`Verify with MAM Explorer:\n${mamExplorerLink}${root}\n`);
    // Artisan Items Completed (Copy + update based on number of Items in Order)
    await publish({
        status: response.resStatusArt+": "+response.resItem1+" (Quantity "+response.resQuant1+") by "+response.resArt1+", "+response.resCom1,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resDay1+"/"+response.resMonth1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem2+" (Quantity "+response.resQuant2+") by "+response.resArt2+", "+response.resCom2,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resDay1+"/"+response.resMonth1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem3+" (Quantity "+response.resQuant3+") by "+response.resArt3+", "+response.resCom3,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resDay1+"/"+response.resMonth1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem4+" (Quantity "+response.resQuant4+") by "+response.resArt4+", "+response.resCom4,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resDay2+"/"+response.resMonth2+"/"+response.resYear2
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem5+" (Quantity "+response.resQuant5+") by "+response.resArt5+", "+response.resCom5,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resDay2+"/"+response.resMonth2+"/"+response.resYear2
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem6+" (Quantity "+response.resQuant6+") by "+response.resArt6+", "+response.resCom6,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resDay2+"/"+response.resMonth2+"/"+response.resYear2
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem7+" (Quantity "+response.resQuant7+") by "+response.resArt7+", "+response.resCom7,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resDay2+"/"+response.resMonth2+"/"+response.resYear2
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem8+" (Quantity "+response.resQuant8+") by "+response.resArt8+", "+response.resCom8,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resDay3+"/"+response.resMonth3+"/"+response.resYear3
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem9+" (Quantity "+response.resQuant9+") by "+response.resArt9+", "+response.resCom9,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resDay3+"/"+response.resMonth3+"/"+response.resYear3
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem10+" (Quantity "+response.resQuant10+") by "+response.resArt10+", "+response.resCom10,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resDay3+"/"+response.resMonth3+"/"+response.resYear3
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem11+" (Quantity "+response.resQuant11+") by "+response.resArt11+", "+response.resCom11,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resDay3+"/"+response.resMonth3+"/"+response.resYear3
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem12+" (Quantity "+response.resQuant12+") by "+response.resArt12+", "+response.resCom12,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resDay3+"/"+response.resMonth3+"/"+response.resYear3
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem13+" (Quantity "+response.resQuant13+") by "+response.resArt13+", "+response.resCom13,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resDay4+"/"+response.resMonth4+"/"+response.resYear4
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem14+" (Quantity "+response.resQuant14+") by "+response.resArt14+", "+response.resCom14,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resDay4+"/"+response.resMonth4+"/"+response.resYear4
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem15+" (Quantity "+response.resQuant15+") by "+response.resArt15+", "+response.resCom15,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resDay5+"/"+response.resMonth5+"/"+response.resYear5
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem16+" (Quantity "+response.resQuant16+") by "+response.resArt16+", "+response.resCom16,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resDay5+"/"+response.resMonth5+"/"+response.resYear5
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem17+" (Quantity "+response.resQuant17+") by "+response.resArt17+", "+response.resCom17,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resDay6+"/"+response.resMonth6+"/"+response.resYear6
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem18+" (Quantity "+response.resQuant18+") by "+response.resArt18+", "+response.resCom18,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resDay6+"/"+response.resMonth6+"/"+response.resYear6
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem19+" (Quantity "+response.resQuant19+") by "+response.resArt19+", "+response.resCom19,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resDay6+"/"+response.resMonth6+"/"+response.resYear6
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem20+" (Quantity "+response.resQuant20+") by "+response.resArt20+", "+response.resCom20,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resDay6+"/"+response.resMonth6+"/"+response.resYear6
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem21+" (Quantity "+response.resQuant21+") by "+response.resArt21+", "+response.resCom21,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resDay6+"/"+response.resMonth6+"/"+response.resYear6
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem22+" (Quantity "+response.resQuant22+") by "+response.resArt22+", "+response.resCom22,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resDay7+"/"+response.resMonth7+"/"+response.resYear7
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem23+" (Quantity "+response.resQuant23+") by "+response.resArt23+", "+response.resCom23,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resDay7+"/"+response.resMonth7+"/"+response.resYear7
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem24+" (Quantity "+response.resQuant24+") by "+response.resArt24+", "+response.resCom24,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resDay7+"/"+response.resMonth7+"/"+response.resYear7
    });
    // Brand Order Finalised
    await publish({
      status: response.resStatusBrand+" "+response.resOrderNo+" by "+response.resVerByBrand+", "+response.resLocBrand,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+(new Date()).toLocaleString(),
    });

    return root
    }
  
  // Callback used to pass data out of the fetch
  const logData = data => console.log('Fetched and parsed', JSON.parse(trytesToAscii(data)), '\n')
  
  publishAll()
    .then(async root => {
  
      // Output asyncronously using "logData" callback function
      await Mam.fetch(root, 'public', null, logData)
  
      // Output syncronously once fetch is completed
      const result = await Mam.fetch(root, 'public')
      result.messages.forEach(message => console.log('Fetched and parsed', JSON.parse(trytesToAscii(message)), '\n'))
  
      console.log(`Verify with MAM Explorer:\n${mamExplorerLink}${root}\n`);
    })
    //convert the response in JSON formatand pass to the display on /MAM2 response page
    //   res.end('All records for the Artisans and the Brand have been successfully added. Thank you!'); 
    res.sendFile(__dirname + "/pages/" + "UpdateCompleted.html");  
  });

// MAM post route for ordSXA0001.html (Initiate Order, Confirm Items (34 / 1 community), Confirm Items Completed)   
app.post('/SXA0001_123', urlencodedParser, function(req, res){
  const Mam = require('./mam.client.js/lib/mam.client.js')
  const { composeAPI } = require('@iota/core');
  const { asciiToTrytes, trytesToAscii } = require('@iota/converter')
  // const provider = 'https://nodes.devnet.iota.org'
  const iota = composeAPI({provider: config.provider});
  const mamExplorerLink = `https://thetangle.org/mam/`
  // const seed = 'LQUNUKSOHUAX9PP9JKVRKGQOWOWRJIJLMAYHWQSGAIEIVKMGG9VFJARFI9PYUQISYIMGRYQHOAMACQLTT'
  // var asyncLoop = require('node-async-loop');

  // Update to change number of resItems from Excel HTML Template
  // Dates respond to number of communities, resItems to number of Items in Order
  response = {
    resSeed: req.body.seed, 
    resOrderNo: req.body.reqOrderNo,
    resStatusROF: req.body.statusROF, resStatusArt: req.body.statusArt, resStatusBrand: req.body.statusBrand,
    resVerByROF: req.body.verByROF, resVerByBrand: req.body.verByBrand,
    resLocROF: req.body.locROF, resLocBrand: req.body.locBrand,
    resItem1: req.body.item1, resQuant1: req.body.quant1, resArt1: req.body.art1, resCom1: req.body.com1,
    resItem2: req.body.item2, resQuant2: req.body.quant2, resArt2: req.body.art2, resCom2: req.body.com2,
    resItem3: req.body.item3, resQuant3: req.body.quant3, resArt3: req.body.art3, resCom3: req.body.com3,
    resItem4: req.body.item4, resQuant4: req.body.quant4, resArt4: req.body.art4, resCom4: req.body.com4,
    resItem5: req.body.item5, resQuant5: req.body.quant5, resArt5: req.body.art5, resCom5: req.body.com5,
    resItem6: req.body.item6, resQuant6: req.body.quant6, resArt6: req.body.art6, resCom6: req.body.com6,
    resItem7: req.body.item7, resQuant7: req.body.quant7, resArt7: req.body.art7, resCom7: req.body.com7,
    resItem8: req.body.item8, resQuant8: req.body.quant8, resArt8: req.body.art8, resCom8: req.body.com8,
    resItem9: req.body.item9, resQuant9: req.body.quant9, resArt9: req.body.art9, resCom9: req.body.com9,
    resItem10: req.body.item10, resQuant10: req.body.quant10, resArt10: req.body.art10, resCom10: req.body.com10,
    resItem11: req.body.item11, resQuant11: req.body.quant11, resArt11: req.body.art11, resCom11: req.body.com11,
    resItem12: req.body.item12, resQuant12: req.body.quant12, resArt12: req.body.art12, resCom12: req.body.com12,
    resItem13: req.body.item13, resQuant13: req.body.quant13, resArt13: req.body.art13, resCom13: req.body.com13,
    resItem14: req.body.item14, resQuant14: req.body.quant14, resArt14: req.body.art14, resCom14: req.body.com14,
    resItem15: req.body.item15, resQuant15: req.body.quant15, resArt15: req.body.art15, resCom15: req.body.com15,
    resItem16: req.body.item16, resQuant16: req.body.quant16, resArt16: req.body.art16, resCom16: req.body.com16,
    resItem17: req.body.item17, resQuant17: req.body.quant17, resArt17: req.body.art17, resCom17: req.body.com17,
    resItem18: req.body.item18, resQuant18: req.body.quant18, resArt18: req.body.art18, resCom18: req.body.com18,
    resItem19: req.body.item19, resQuant19: req.body.quant19, resArt19: req.body.art19, resCom19: req.body.com19,
    resItem20: req.body.item20, resQuant20: req.body.quant20, resArt20: req.body.art20, resCom20: req.body.com20,
    resItem21: req.body.item21, resQuant21: req.body.quant21, resArt21: req.body.art21, resCom21: req.body.com21,
    resItem22: req.body.item22, resQuant22: req.body.quant22, resArt22: req.body.art22, resCom22: req.body.com22,
    resItem23: req.body.item23, resQuant23: req.body.quant23, resArt23: req.body.art23, resCom23: req.body.com23,
    resItem24: req.body.item24, resQuant24: req.body.quant24, resArt24: req.body.art24, resCom24: req.body.com24,
    resItem25: req.body.item25, resQuant25: req.body.quant25, resArt25: req.body.art25, resCom25: req.body.com25,
    resItem26: req.body.item26, resQuant26: req.body.quant26, resArt26: req.body.art26, resCom26: req.body.com26,
    resItem27: req.body.item27, resQuant27: req.body.quant27, resArt27: req.body.art27, resCom27: req.body.com27,
    resItem28: req.body.item28, resQuant28: req.body.quant28, resArt28: req.body.art28, resCom28: req.body.com28,
    resItem29: req.body.item29, resQuant29: req.body.quant29, resArt29: req.body.art29, resCom29: req.body.com29,
    resItem30: req.body.item30, resQuant30: req.body.quant30, resArt30: req.body.art30, resCom30: req.body.com30,
    resItem31: req.body.item31, resQuant31: req.body.quant31, resArt31: req.body.art31, resCom31: req.body.com31,
    resItem32: req.body.item32, resQuant32: req.body.quant32, resArt32: req.body.art32, resCom32: req.body.com32,
    resItem33: req.body.item33, resQuant33: req.body.quant33, resArt33: req.body.art33, resCom33: req.body.com33,
    resItem34: req.body.item34, resQuant34: req.body.quant34, resArt34: req.body.art34, resCom34: req.body.com34,
    resMonth1: new Date(req.body.date1).getMonth()+1, resDay1: new Date(req.body.date1).getDate(), resYear1: new Date(req.body.date1).getFullYear(),
};
console.log('Publishing SXA0001 Records...');
// console.log(response);

  const seed = response.seed;
  console.log('HTML Seed: ', seed);
  //let mamState = Mam.init(provider, seed)
  let mamState = Mam.init(config.provider, seed)
  console.log('mamState: ', mamState); 

  // Publish to tangle
  const publish = async packet => {
      // Create MAM Payload - STRING OF TRYTES
      const trytes = asciiToTrytes(JSON.stringify(packet))
      const message = Mam.create(mamState, trytes)
  
      // Save new mamState
      mamState = message.state
  
      // Attach the payload
      await Mam.attach(message.payload, message.address, 3, 14)
  
      console.log('Published', packet, '\n');
      return message.root
  }
  
  const publishAll = async () => {
    const root = await publish({
      status: response.resStatusROF+" "+response.resOrderNo+" by "+response.resVerByROF+", "+response.resLocROF,
      verification: response.resVerByROF+", "+response.resLocROF+" at 03/09/2019, 10:12:43 AM"
    });
    // Added early record in case crashes...
    console.log(`Verify with MAM Explorer:\n${mamExplorerLink}${root}\n`);
    // Artisan Items Completed (Copy + update based on number of Items in Order)
    await publish({
      status: response.resStatusArt+": "+response.resItem1+" (Quantity "+response.resQuant1+") by "+response.resArt1+", "+response.resCom1,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem2+" (Quantity "+response.resQuant2+") by "+response.resArt2+", "+response.resCom2,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem3+" (Quantity "+response.resQuant3+") by "+response.resArt3+", "+response.resCom3,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem4+" (Quantity "+response.resQuant4+") by "+response.resArt4+", "+response.resCom4,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem5+" (Quantity "+response.resQuant5+") by "+response.resArt5+", "+response.resCom5,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem6+" (Quantity "+response.resQuant6+") by "+response.resArt6+", "+response.resCom6,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem7+" (Quantity "+response.resQuant7+") by "+response.resArt7+", "+response.resCom7,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem8+" (Quantity "+response.resQuant8+") by "+response.resArt8+", "+response.resCom8,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem9+" (Quantity "+response.resQuant9+") by "+response.resArt9+", "+response.resCom9,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem10+" (Quantity "+response.resQuant10+") by "+response.resArt10+", "+response.resCom10,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem11+" (Quantity "+response.resQuant11+") by "+response.resArt11+", "+response.resCom11,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem12+" (Quantity "+response.resQuant12+") by "+response.resArt12+", "+response.resCom12,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem13+" (Quantity "+response.resQuant13+") by "+response.resArt13+", "+response.resCom13,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem14+" (Quantity "+response.resQuant14+") by "+response.resArt14+", "+response.resCom14,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem15+" (Quantity "+response.resQuant15+") by "+response.resArt15+", "+response.resCom15,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem16+" (Quantity "+response.resQuant16+") by "+response.resArt16+", "+response.resCom16,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem17+" (Quantity "+response.resQuant17+") by "+response.resArt17+", "+response.resCom17,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem18+" (Quantity "+response.resQuant18+") by "+response.resArt18+", "+response.resCom18,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem19+" (Quantity "+response.resQuant19+") by "+response.resArt19+", "+response.resCom19,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem20+" (Quantity "+response.resQuant20+") by "+response.resArt20+", "+response.resCom20,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem21+" (Quantity "+response.resQuant21+") by "+response.resArt21+", "+response.resCom21,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem22+" (Quantity "+response.resQuant22+") by "+response.resArt22+", "+response.resCom22,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem23+" (Quantity "+response.resQuant23+") by "+response.resArt23+", "+response.resCom23,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem24+" (Quantity "+response.resQuant24+") by "+response.resArt24+", "+response.resCom24,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem25+" (Quantity "+response.resQuant25+") by "+response.resArt25+", "+response.resCom25,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem26+" (Quantity "+response.resQuant26+") by "+response.resArt26+", "+response.resCom26,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem27+" (Quantity "+response.resQuant27+") by "+response.resArt27+", "+response.resCom27,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem28+" (Quantity "+response.resQuant28+") by "+response.resArt28+", "+response.resCom28,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem29+" (Quantity "+response.resQuant29+") by "+response.resArt29+", "+response.resCom29,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem30+" (Quantity "+response.resQuant30+") by "+response.resArt30+", "+response.resCom30,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem31+" (Quantity "+response.resQuant31+") by "+response.resArt31+", "+response.resCom31,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem32+" (Quantity "+response.resQuant32+") by "+response.resArt32+", "+response.resCom32,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem33+" (Quantity "+response.resQuant33+") by "+response.resArt33+", "+response.resCom33,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem34+" (Quantity "+response.resQuant34+") by "+response.resArt34+", "+response.resCom34,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
    // Brand Order Finalised
    await publish({
      status: response.resStatusBrand+" "+response.resOrderNo+" by "+response.resVerByBrand+", "+response.resLocBrand,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+(new Date()).toLocaleString(),
    });

    return root
    }
  
  // Callback used to pass data out of the fetch
  const logData = data => console.log('Fetched and parsed', JSON.parse(trytesToAscii(data)), '\n')
  
  publishAll()
    .then(async root => {
  
      // Output asyncronously using "logData" callback function
      await Mam.fetch(root, 'public', null, logData)
  
      // Output syncronously once fetch is completed
      const result = await Mam.fetch(root, 'public')
      result.messages.forEach(message => console.log('Fetched and parsed', JSON.parse(trytesToAscii(message)), '\n'))
  
      console.log(`Verify with MAM Explorer:\n${mamExplorerLink}${root}\n`);
    })
    //convert the response in JSON formatand pass to the display on /MAM2 response page
    //   res.end('All records for the Artisans and the Brand have been successfully added. Thank you!'); 
    res.sendFile(__dirname + "/pages/" + "UpdateCompleted.html");  
  });    

// MAM post route for ordARU0001.html (Initiate Order, Confirm Items (18 / 2 community), Confirm Items Completed)   
app.post('/ARU0001_123', urlencodedParser, function(req, res){
  const Mam = require('./mam.client.js/lib/mam.client.js')
  const { composeAPI } = require('@iota/core');
  const { asciiToTrytes, trytesToAscii } = require('@iota/converter')
  const iota = composeAPI({provider: config.provider});
  const mamExplorerLink = `https://thetangle.org/mam/`

  // Update to change number of resItems from Excel HTML Template
  // Dates respond to number of communities, resItems to number of Items in Order
  response = {
      resSeed: req.body.seed, 
      resOrderNo: req.body.reqOrderNo,
      resStatusROF: req.body.statusROF, resStatusArt: req.body.statusArt, resStatusBrand: req.body.statusBrand,
      resVerByROF: req.body.verByROF, resVerByBrand: req.body.verByBrand,
      resLocROF: req.body.locROF, resLocBrand: req.body.locBrand,
      resItem1: req.body.item1, resQuant1: req.body.quant1, resArt1: req.body.art1, resCom1: req.body.com1,
      resItem2: req.body.item2, resQuant2: req.body.quant2, resArt2: req.body.art2, resCom2: req.body.com2,
      resItem3: req.body.item3, resQuant3: req.body.quant3, resArt3: req.body.art3, resCom3: req.body.com3,
      resItem4: req.body.item4, resQuant4: req.body.quant4, resArt4: req.body.art4, resCom4: req.body.com4,
      resItem5: req.body.item5, resQuant5: req.body.quant5, resArt5: req.body.art5, resCom5: req.body.com5,
      resItem6: req.body.item6, resQuant6: req.body.quant6, resArt6: req.body.art6, resCom6: req.body.com6,
      resItem7: req.body.item7, resQuant7: req.body.quant7, resArt7: req.body.art7, resCom7: req.body.com7,
      resItem8: req.body.item8, resQuant8: req.body.quant8, resArt8: req.body.art8, resCom8: req.body.com8,
      resItem9: req.body.item9, resQuant9: req.body.quant9, resArt9: req.body.art9, resCom9: req.body.com9,
      resItem10: req.body.item10, resQuant10: req.body.quant10, resArt10: req.body.art10, resCom10: req.body.com10,
      resItem11: req.body.item11, resQuant11: req.body.quant11, resArt11: req.body.art11, resCom11: req.body.com11,
      resItem12: req.body.item12, resQuant12: req.body.quant12, resArt12: req.body.art12, resCom12: req.body.com12,
      resItem13: req.body.item13, resQuant13: req.body.quant13, resArt13: req.body.art13, resCom13: req.body.com13,
      resItem14: req.body.item14, resQuant14: req.body.quant14, resArt14: req.body.art14, resCom14: req.body.com14,
      resItem15: req.body.item15, resQuant15: req.body.quant15, resArt15: req.body.art15, resCom15: req.body.com15,
      resItem16: req.body.item16, resQuant16: req.body.quant16, resArt16: req.body.art16, resCom16: req.body.com16,
      resItem17: req.body.item17, resQuant17: req.body.quant17, resArt17: req.body.art17, resCom17: req.body.com17,
      resItem18: req.body.item18, resQuant18: req.body.quant18, resArt18: req.body.art18, resCom18: req.body.com18,
      resMonth1: new Date(req.body.date1).getMonth()+1, resDay1: new Date(req.body.date1).getDate(), resYear1: new Date(req.body.date1).getFullYear(),    
      resMonth2: new Date(req.body.date2).getMonth()+1, resDay2: new Date(req.body.date2).getDate(), resYear2: new Date(req.body.date2).getFullYear(),
  };
  console.log('Publishing ARU0001 Records...');

  const seed = response.seed;
  console.log('HTML Seed: ', seed);
  let mamState = Mam.init(config.provider, seed)
  console.log('mamState: ', mamState); 
  // Publish to tangle
  const publish = async packet => {
      // Create MAM Payload - STRING OF TRYTES
      const trytes = asciiToTrytes(JSON.stringify(packet))
      const message = Mam.create(mamState, trytes)
  
      // Save new mamState
      mamState = message.state
  
      // Attach the payload
      await Mam.attach(message.payload, message.address, 3, 14)
  
      console.log('Published', packet, '\n');
      return message.root
  }
  
  const publishAll = async () => {
    const root = await publish({
      status: response.resStatusROF+" "+response.resOrderNo+" by "+response.resVerByROF+", "+response.resLocROF,
      verification: response.resVerByROF+", "+response.resLocROF+" at 04/09/2019, 12:23:54 AM"
    });
    // Added early record in case crashes...
    console.log(`Verify with MAM Explorer:\n${mamExplorerLink}${root}\n`);
    // Artisan Items Completed (Copy/Paste from Excel HTML Template)
    await publish({
      status: response.resStatusArt+": "+response.resItem1+" (Quantity "+response.resQuant1+") by "+response.resArt1+", "+response.resCom1,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem2+" (Quantity "+response.resQuant2+") by "+response.resArt2+", "+response.resCom2,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth2+"/"+response.resDay2+"/"+response.resYear2
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem3+" (Quantity "+response.resQuant3+") by "+response.resArt3+", "+response.resCom3,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth2+"/"+response.resDay2+"/"+response.resYear2
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem4+" (Quantity "+response.resQuant4+") by "+response.resArt4+", "+response.resCom4,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth2+"/"+response.resDay2+"/"+response.resYear2
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem5+" (Quantity "+response.resQuant5+") by "+response.resArt5+", "+response.resCom5,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth2+"/"+response.resDay2+"/"+response.resYear2
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem6+" (Quantity "+response.resQuant6+") by "+response.resArt6+", "+response.resCom6,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth2+"/"+response.resDay2+"/"+response.resYear2
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem7+" (Quantity "+response.resQuant7+") by "+response.resArt7+", "+response.resCom7,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth2+"/"+response.resDay2+"/"+response.resYear2
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem8+" (Quantity "+response.resQuant8+") by "+response.resArt8+", "+response.resCom8,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth2+"/"+response.resDay2+"/"+response.resYear2
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem9+" (Quantity "+response.resQuant9+") by "+response.resArt9+", "+response.resCom9,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth2+"/"+response.resDay2+"/"+response.resYear2
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem10+" (Quantity "+response.resQuant10+") by "+response.resArt10+", "+response.resCom10,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth2+"/"+response.resDay2+"/"+response.resYear2
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem11+" (Quantity "+response.resQuant11+") by "+response.resArt11+", "+response.resCom11,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth2+"/"+response.resDay2+"/"+response.resYear2
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem12+" (Quantity "+response.resQuant12+") by "+response.resArt12+", "+response.resCom12,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth2+"/"+response.resDay2+"/"+response.resYear2
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem13+" (Quantity "+response.resQuant13+") by "+response.resArt13+", "+response.resCom13,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth2+"/"+response.resDay2+"/"+response.resYear2
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem14+" (Quantity "+response.resQuant14+") by "+response.resArt14+", "+response.resCom14,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth2+"/"+response.resDay2+"/"+response.resYear2
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem15+" (Quantity "+response.resQuant15+") by "+response.resArt15+", "+response.resCom15,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth2+"/"+response.resDay2+"/"+response.resYear2
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem16+" (Quantity "+response.resQuant16+") by "+response.resArt16+", "+response.resCom16,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth2+"/"+response.resDay2+"/"+response.resYear2
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem17+" (Quantity "+response.resQuant17+") by "+response.resArt17+", "+response.resCom17,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth2+"/"+response.resDay2+"/"+response.resYear2
      });
      await publish({
      status: response.resStatusArt+": "+response.resItem18+" (Quantity "+response.resQuant18+") by "+response.resArt18+", "+response.resCom18,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth2+"/"+response.resDay2+"/"+response.resYear2
      });
  
    // Brand Order Finalised
    await publish({
      status: response.resStatusBrand+" "+response.resOrderNo+" by "+response.resVerByBrand+", "+response.resLocBrand,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+(new Date()).toLocaleString(),
    });

    return root
    }
  
  // Callback used to pass data out of the fetch
  const logData = data => console.log('Fetched and parsed', JSON.parse(trytesToAscii(data)), '\n')
  
  publishAll()
    .then(async root => {
  
      // Output asyncronously using "logData" callback function
      await Mam.fetch(root, 'public', null, logData)
  
      // Output syncronously once fetch is completed
      const result = await Mam.fetch(root, 'public')
      result.messages.forEach(message => console.log('Fetched and parsed', JSON.parse(trytesToAscii(message)), '\n'))
  
      console.log(`Verify with MAM Explorer:\n${mamExplorerLink}${root}\n`);
    })
    //convert the response in JSON formatand pass to the display on /MAM2 response page
    //   res.end('All records for the Artisans and the Brand have been successfully added. Thank you!'); 
    res.sendFile(__dirname + "/pages/" + "UpdateCompleted.html");  
  }); 

// ********** DEVNET EXAMPLE OLD ********** //

// MAM post route for ordACP0001.html (Initiate Order, Confirm Items (38 / 1 community), Confirm Items Completed)  
app.post('/ACP0001_123', urlencodedParser, function(req, res){
  const Mam = require('./mam.client.js/lib/mam.client.js')
  const { asciiToTrytes, trytesToAscii } = require('@iota/converter')
  const provider = 'https://nodes.devnet.iota.org'
  
  const mamExplorerLink = `https://devnet.thetangle.org/mam/`

  // Update to change number of resItems from Excel HTML Template
  // Dates respond to number of communities, resItems to number of Items in Order
  response = {
      resSeed: req.body.seed, 
      resOrderNo: req.body.reqOrderNo,
      resStatusROF: req.body.statusROF, resStatusArt: req.body.statusArt, resStatusBrand: req.body.statusBrand,
      resVerByROF: req.body.verByROF, resVerByBrand: req.body.verByBrand,
      resLocROF: req.body.locROF, resLocBrand: req.body.locBrand,
      resItem1: req.body.item1, resQuant1: req.body.quant1, resArt1: req.body.art1, resCom1: req.body.com1,
      resItem2: req.body.item2, resQuant2: req.body.quant2, resArt2: req.body.art2, resCom2: req.body.com2,
      resItem3: req.body.item3, resQuant3: req.body.quant3, resArt3: req.body.art3, resCom3: req.body.com3,
      resItem4: req.body.item4, resQuant4: req.body.quant4, resArt4: req.body.art4, resCom4: req.body.com4,
      resItem5: req.body.item5, resQuant5: req.body.quant5, resArt5: req.body.art5, resCom5: req.body.com5,
      resItem6: req.body.item6, resQuant6: req.body.quant6, resArt6: req.body.art6, resCom6: req.body.com6,
      resItem7: req.body.item7, resQuant7: req.body.quant7, resArt7: req.body.art7, resCom7: req.body.com7,
      resItem8: req.body.item8, resQuant8: req.body.quant8, resArt8: req.body.art8, resCom8: req.body.com8,
      resItem9: req.body.item9, resQuant9: req.body.quant9, resArt9: req.body.art9, resCom9: req.body.com9,
      resItem10: req.body.item10, resQuant10: req.body.quant10, resArt10: req.body.art10, resCom10: req.body.com10,
      resItem11: req.body.item11, resQuant11: req.body.quant11, resArt11: req.body.art11, resCom11: req.body.com11,
      resItem12: req.body.item12, resQuant12: req.body.quant12, resArt12: req.body.art12, resCom12: req.body.com12,
      resItem13: req.body.item13, resQuant13: req.body.quant13, resArt13: req.body.art13, resCom13: req.body.com13,
      resItem14: req.body.item14, resQuant14: req.body.quant14, resArt14: req.body.art14, resCom14: req.body.com14,
      resItem15: req.body.item15, resQuant15: req.body.quant15, resArt15: req.body.art15, resCom15: req.body.com15,
      resItem16: req.body.item16, resQuant16: req.body.quant16, resArt16: req.body.art16, resCom16: req.body.com16,
      resItem17: req.body.item17, resQuant17: req.body.quant17, resArt17: req.body.art17, resCom17: req.body.com17,
      resItem18: req.body.item18, resQuant18: req.body.quant18, resArt18: req.body.art18, resCom18: req.body.com18,
      resItem19: req.body.item19, resQuant19: req.body.quant19, resArt19: req.body.art19, resCom19: req.body.com19,
      resItem20: req.body.item20, resQuant20: req.body.quant20, resArt20: req.body.art20, resCom20: req.body.com20,
      resItem21: req.body.item21, resQuant21: req.body.quant21, resArt21: req.body.art21, resCom21: req.body.com21,
      resItem22: req.body.item22, resQuant22: req.body.quant22, resArt22: req.body.art22, resCom22: req.body.com22,
      resItem23: req.body.item23, resQuant23: req.body.quant23, resArt23: req.body.art23, resCom23: req.body.com23,
      resItem24: req.body.item24, resQuant24: req.body.quant24, resArt24: req.body.art24, resCom24: req.body.com24,
      resItem25: req.body.item25, resQuant25: req.body.quant25, resArt25: req.body.art25, resCom25: req.body.com25,
      resItem26: req.body.item26, resQuant26: req.body.quant26, resArt26: req.body.art26, resCom26: req.body.com26,
      resItem27: req.body.item27, resQuant27: req.body.quant27, resArt27: req.body.art27, resCom27: req.body.com27,
      resItem28: req.body.item28, resQuant28: req.body.quant28, resArt28: req.body.art28, resCom28: req.body.com28,
      resItem29: req.body.item29, resQuant29: req.body.quant29, resArt29: req.body.art29, resCom29: req.body.com29,
      resItem30: req.body.item30, resQuant30: req.body.quant30, resArt30: req.body.art30, resCom30: req.body.com30,
      resItem31: req.body.item31, resQuant31: req.body.quant31, resArt31: req.body.art31, resCom31: req.body.com31,
      resItem32: req.body.item32, resQuant32: req.body.quant32, resArt32: req.body.art32, resCom32: req.body.com32,
      resItem33: req.body.item33, resQuant33: req.body.quant33, resArt33: req.body.art33, resCom33: req.body.com33,
      resItem34: req.body.item34, resQuant34: req.body.quant34, resArt34: req.body.art34, resCom34: req.body.com34,
      resItem35: req.body.item35, resQuant35: req.body.quant35, resArt35: req.body.art35, resCom35: req.body.com35,
      resItem36: req.body.item36, resQuant36: req.body.quant36, resArt36: req.body.art36, resCom36: req.body.com36,
      resItem37: req.body.item37, resQuant37: req.body.quant37, resArt37: req.body.art37, resCom37: req.body.com37,
      resItem38: req.body.item38, resQuant38: req.body.quant38, resArt38: req.body.art38, resCom38: req.body.com38,
      resMonth1: new Date(req.body.date1).getMonth()+1, resDay1: new Date(req.body.date1).getDate(), resYear1: new Date(req.body.date1).getFullYear(),
  };
  // console.log(response);

  const seed = response.seed
  console.log('Seed: ', seed)

  let mamState = Mam.init(provider, seed)
  console.log('mamState: ', mamState) 

  // Publish to tangle
  const publish = async packet => {
      // Create MAM Payload - STRING OF TRYTES
      const trytes = asciiToTrytes(JSON.stringify(packet))
      const message = Mam.create(mamState, trytes)
  
      // Save new mamState
      mamState = message.state
  
      // Attach the message.
      // Depth (3 or 4), MWM (9 minimum weight magnitude for Dev, 14 for MainNet) 
      await Mam.attach(message.payload, message.address, 3, 9)
  
      console.log('Published', packet, '\n');
      return message.root
  }
  
  const publishAll = async () => {
    const root = await publish({
      status: response.resStatusROF+" "+response.resOrderNo+" by "+response.resVerByROF+", "+response.resLocROF,
      verification: response.resVerByROF+", "+response.resLocROF+" at 26/09/2019, 02:32:40 PM"
    });
    // Added early record in case crashes...
    console.log(`Verify with MAM Explorer:\n${mamExplorerLink}${root}\n`);  
    // Artisan Items Completed (Copy + update based on number of Items in Order)
      await publish({
        status: response.resStatusArt+": "+response.resItem1+" (Quantity "+response.resQuant1+") by "+response.resArt1+", "+response.resCom1,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem2+" (Quantity "+response.resQuant2+") by "+response.resArt2+", "+response.resCom2,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem3+" (Quantity "+response.resQuant3+") by "+response.resArt3+", "+response.resCom3,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem4+" (Quantity "+response.resQuant4+") by "+response.resArt4+", "+response.resCom4,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem5+" (Quantity "+response.resQuant5+") by "+response.resArt5+", "+response.resCom5,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem6+" (Quantity "+response.resQuant6+") by "+response.resArt6+", "+response.resCom6,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem7+" (Quantity "+response.resQuant7+") by "+response.resArt7+", "+response.resCom7,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem8+" (Quantity "+response.resQuant8+") by "+response.resArt8+", "+response.resCom8,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem9+" (Quantity "+response.resQuant9+") by "+response.resArt9+", "+response.resCom9,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem10+" (Quantity "+response.resQuant10+") by "+response.resArt10+", "+response.resCom10,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem11+" (Quantity "+response.resQuant11+") by "+response.resArt11+", "+response.resCom11,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem12+" (Quantity "+response.resQuant12+") by "+response.resArt12+", "+response.resCom12,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem13+" (Quantity "+response.resQuant13+") by "+response.resArt13+", "+response.resCom13,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem14+" (Quantity "+response.resQuant14+") by "+response.resArt14+", "+response.resCom14,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem15+" (Quantity "+response.resQuant15+") by "+response.resArt15+", "+response.resCom15,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem16+" (Quantity "+response.resQuant16+") by "+response.resArt16+", "+response.resCom16,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem17+" (Quantity "+response.resQuant17+") by "+response.resArt17+", "+response.resCom17,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem18+" (Quantity "+response.resQuant18+") by "+response.resArt18+", "+response.resCom18,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem19+" (Quantity "+response.resQuant19+") by "+response.resArt19+", "+response.resCom19,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem20+" (Quantity "+response.resQuant20+") by "+response.resArt20+", "+response.resCom20,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem21+" (Quantity "+response.resQuant21+") by "+response.resArt21+", "+response.resCom21,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem22+" (Quantity "+response.resQuant22+") by "+response.resArt22+", "+response.resCom22,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem23+" (Quantity "+response.resQuant23+") by "+response.resArt23+", "+response.resCom23,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem24+" (Quantity "+response.resQuant24+") by "+response.resArt24+", "+response.resCom24,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem25+" (Quantity "+response.resQuant25+") by "+response.resArt25+", "+response.resCom25,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem26+" (Quantity "+response.resQuant26+") by "+response.resArt26+", "+response.resCom26,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem27+" (Quantity "+response.resQuant27+") by "+response.resArt27+", "+response.resCom27,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem28+" (Quantity "+response.resQuant28+") by "+response.resArt28+", "+response.resCom28,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem29+" (Quantity "+response.resQuant29+") by "+response.resArt29+", "+response.resCom29,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem30+" (Quantity "+response.resQuant30+") by "+response.resArt30+", "+response.resCom30,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem31+" (Quantity "+response.resQuant31+") by "+response.resArt31+", "+response.resCom31,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem32+" (Quantity "+response.resQuant32+") by "+response.resArt32+", "+response.resCom32,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem33+" (Quantity "+response.resQuant33+") by "+response.resArt33+", "+response.resCom33,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem34+" (Quantity "+response.resQuant34+") by "+response.resArt34+", "+response.resCom34,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem35+" (Quantity "+response.resQuant35+") by "+response.resArt35+", "+response.resCom35,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem36+" (Quantity "+response.resQuant36+") by "+response.resArt36+", "+response.resCom36,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem37+" (Quantity "+response.resQuant37+") by "+response.resArt37+", "+response.resCom37,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
        });
        await publish({
        status: response.resStatusArt+": "+response.resItem38+" (Quantity "+response.resQuant38+") by "+response.resArt38+", "+response.resCom38,
        verification: response.resVerByBrand+", "+response.resLocBrand+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1
        });  
    // Brand Order Finalised
    await publish({
      status: response.resStatusBrand+" "+response.resOrderNo+" by "+response.resVerByBrand+", "+response.resLocBrand,
      verification: response.resVerByBrand+", "+response.resLocBrand+" at "+(new Date()).toLocaleString(),
    });

    return root
    }
  
  // Callback used to pass data out of the fetch
  const logData = data => console.log('Fetched and 1 parsed', JSON.parse(trytesToAscii(data)), '\n')


  publishAll()
    .then(async root => {
  
      // Output asyncronously using "logData" callback function
      await Mam.fetch(root, 'public', null, logData)
  
      // Output syncronously once fetch is completed
      const result = await Mam.fetch(root, 'public')
      result.messages.forEach(message => console.log('Fetched and parsed', JSON.parse(trytesToAscii(message)), '\n'))
  
      console.log(`Verify with MAM Explorer:\n${mamExplorerLink}${root}\n`);
    })
    //convert the response in JSON formatand pass to the display on /MAM2 response page
    //   res.end('All records for the Artisans and the Brand have been successfully added. Thank you!'); 
    res.sendFile(__dirname + "/pages/" + "UpdateCompleted.html");  
  });   
  
var server = app.listen(8080, function(){
  console.log("ROF MVP App listening http://localhost:8080. Page example http://localhost:8080/Order_LAG0001");
});