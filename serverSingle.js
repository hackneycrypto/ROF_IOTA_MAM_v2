var express = require('express');
var bodyParser = require('body-parser');
const config = require('./config');
var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// Serve Static Assets
app.use(express.static('public'));
// Virtual Path Prefix '/static'
app.use('/static', express.static('public'))
app.get('/Order_COL0001_1', function(req, res) {
  res.sendFile(__dirname + "/pages/" + "COL0001_1.html");
});

// ********** POST ROUTES FOR SINGLE TRANSACTION UPDATES ********** //

// MAM post route for ordCOL0001.html (Initiate Order Only (28 Items / 1 community))  ** Example Not used **
app.post('/COL0001_1', urlencodedParser, function(req, res){
  
  const Mam = require('@iota/mam')
  const { asciiToTrytes, trytesToAscii } = require('@iota/converter')

  // Dev
  // const provider = 'https://nodes.devnet.iota.org'
  // const mamExplorerLink = 'https://devnet.thetangle.org/mam/'
  
  // Live
  // const provider = config.provider  
  // const provider = 'https://nodes.thetangle.org:443'
  // const mamExplorerLink = 'https://thetangle.org/mam/'

  response = {
    resSeed: req.body.seed, 
    resOrderNo: req.body.reqOrderNo,
    resStatusROF: req.body.statusROF,
    resVerByROF: req.body.verByROF, resVerByBrand: req.body.verByBrand,
    resLocROF: req.body.locROF, resLocBrand: req.body.locBrand,
    resMonth1: new Date(req.body.date1).getMonth()+1, resDay1: new Date(req.body.date1).getDate(), resYear1: new Date(req.body.date1).getFullYear(),
  };
  console.log(response);
  
  const seed = response.resSeed;
  
  // before this was set to msg. Was then used on the publish() below
  // changes to yourMessage
  const msg = ({
    status: response.resStatusROF+" "+response.resOrderNo+" by "+response.resVerByROF+", "+response.resLocROF,
    verification: response.resVerByROF+", "+response.resLocROF+" at "+response.resMonth1+"/"+response.resDay1+"/"+response.resYear1,
    });
  res.sendFile(__dirname + "/pages/" + "UpdateCompleted.html");
  
  let mamState = null;
  // let mamState = Mam.init(config.provider, seed)
  async function fetchStartCount(){
      let trytes = iota.utils.toTrytes('START');
      const message = Mam.create(mamState, trytes);
      //let message = Mam.create(mamState, trytes);
      console.log(`Verify MAM Channel with MAM Explorer:\n${mamExplorerLink}${message.root}\n`);
      // console.log("The first root @ https://mam-explorer.firebaseapp.com/?provider=https%3A%2F%2Fnodes.devnet.iota.org&mode=public&root=%s", message.root);
      console.log();
      // Fetch all the messages upward from the first root.
      return await Mam.fetch(message.root, 'public', null, null);
  }
  
  async function publish(packet){
      // Create the message.
      let trytes = iota.utils.toTrytes(JSON.stringify(packet))
      let message = Mam.create(mamState, trytes);
      // Set the mam state so we can keep adding messages.
      mamState = message.state;
      console.log('Sending message: ', packet);
      console.log('Message Root:', message.root);
      console.log('Address Root: ', message.address);
      console.log();
      // Attach the message.
      // Depth (3 or 4), MWM (9 minimum weight magnitude for Dev, 14 for MainNet) 
      return await Mam.attach(message.payload, message.address, 3, 9);
  }
  
  // Initiate the mam state with the given seed at index 0.
  
  mamState = Mam.init(iota, seed, 2, 0);
  
  // Fetch all the messages in the stream.
  fetchStartCount().then(v => {
      // Log the messages.
      let startCount = v.messages.length;
      console.log('Messages already in the stream:');
      for (let i = 0; i < v.messages.length; i++){
          let msg = v.messages[i];
          console.log(JSON.parse(iota.utils.fromTrytes(msg)));
      }
      console.log();
  
      // To add messages at the end we need to set the startCount for the mam state to the current amount of messages.
      mamState = Mam.init(iota, seed, 2, startCount);

      //added this. Before it was removed and publish() below was set to msg
      // let newMessage = yourMessage;
  
      // Now the mam state is set, we can add the message.
      publish(msg);
      console.log(`Verify Custom Tag added with Tag Explorer:\n${tagExplorerLink}${'ROFTAGTESTAGAIN999999999999/devnet'}\n`)
  
  }).catch(ex => {
      console.log(ex);
  });
  });

var server = app.listen(8080, function(){
  console.log("Goto http://localhost:8080/Order_COL0001_1");
});