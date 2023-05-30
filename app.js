
const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 5000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'views')));
app.use(session({ secret: 'admin', resave: false, saveUninitialized: true }));


let registrations = [];
let rejectedRegistrations = [];
let clients = [];



app.get('/', (req, res) => {
  res.render('welcome');
});


app.get('/banker_dashboard', (req, res) => {
  if (req.session.userType === 'banker') {
    res.render('banker_dashboard', { registrations });
  } else {
    res.redirect('/login');
  }
});

app.get('/registrationBanker', (req, res) => {
  res.render('registrationBanker');
});


app.get('/registration', (req, res) => {
  res.render('registration');
});



app.post('/registration', (req, res) => {
  const { username, password, fullName, dateOfBirth, nationalId } = req.body;

  const existingUser = registrations.find(reg => reg.username === username);
  if (existingUser) {
    res.render('registration', { error: 'Username already taken. Please try a different username.' });
    return;
  }

  const registrationDetails = {
    username,
    password,
    fullName,
    dateOfBirth,
    nationalId,
    status: 'pending'
  };

  registrations.push(registrationDetails);
  

  res.render('registration_success');
});

app.post('/banker/confirm', (req, res) => {
  const { username, action } = req.body;

  const registration = registrations.find(reg => reg.username === username);

  if (!registration) {
    res.redirect('/error');
    return;
  }

  if (action === 'accept') {
    registration.status = 'client';

    clients.push(registration);

    registrations = registrations.filter(reg => reg.username !== username);
  } else if (action === 'reject') {
    registration.status = 'rejected';

    rejectedRegistrations.push({ username: registration.username, password: registration.password });

    registrations = registrations.filter(reg => reg.username !== username);
  } else {
    res.redirect('/error');
    return;
  }

  res.redirect('/banker_dashboard');
});



  
app.get('/admin_dashboard', (req, res) => {
  res.render('admin_dashboard');
});
app.get('/set_reminders_client', (req, res) => {
  res.render('set_reminders_client');
});
app.get('/view_single_loan', (req, res) => {
  res.render('view_single_loan');
});
app.get('/view_single_CC', (req, res) => {
  res.render('view_single_CC');
});
app.get('/View_ClientsDetails', (req, res) => {
  res.render('View_ClientsDetails');
});
app.get('/View_Clients', (req, res) => {
  res.render('View_Clients');
});

app.get('/rejection_page', (req, res) => {
  res.render('rejection_page');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'banker' && password === 'password') {
    req.session.userType = 'banker';
    res.redirect('/registrationBanker');
    return;
  }

  if (username === 'admin' && password === 'password') {
    req.session.userType = 'admin';
    res.redirect('/admin_dashboard');
    return;
  }

  if (username === '1' && password === '1') {
    req.session.userType = 'client';
    res.redirect('/client_dashboard');
    return;
  }

  // Handle invalid login credentials
  res.render('login', { error: 'Invalid username or password' });
});

app.get('/client_dashboard', (req, res) => {
  if (req.session.userType === 'client') {
    res.render('client_dashboard', { registrations });
  } else {
    res.redirect('/login');
  }
});








app.get('/close_bank_account', (req, res) => {

  res.render('close_bank_account');
});





app.get('/view_credit_card_transactions', (req, res) => {
  res.render('view_credit_card_transactions');
});

app.get('/view_credit_card_points', (req, res) => {
  res.render('view_credit_card_points');
});
app.get('/set_reminders', (req, res) => {
  res.render('set_reminders');
});
app.get('/creditcard_issues', (req, res) => {
  res.render('creditcard_issues');
});

app.get('/view_third_party_transactions', (req, res) => {
  res.render('view_third_party_transactions');
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/login');
  });
});



//added part

app.get('/view_bank_transactions', (req, res) => {
  res.render('view_bank_transactions');
})

app.get('/reportcreditcarddamage', (req, res) => {
  res.render('report_card_damage');
});

app.get('/reportcreditcardloss', (req, res) => {
  res.render('report_card_loss');
});

app.get('/reportcreditcardtheft', (req, res) => {
  res.render('report_card_theft');
});
app.get('/reporttechnicalissues', (req, res) => {
  res.render('report_technical_issues');
});

app.get('/paybillbank', (req, res) => {
  res.render('pay_bill_bank');
});

app.get('/paybillthirdparty', (req, res) => {
  res.render('pay_bills_third_party');
});

app.get('/creditcardrequest', (req, res) => {
  res.render('credit_card_request');
});

app.get('/transfer_money', (req, res) => {
  res.render('transfer_money');
});

app.get('/transfer', (req, res) => {
  res.render('transfer');
});

app.get('/personalloan', (req, res) => {
  res.render('personalloan');
});

app.get('/carloan', (req, res) => {
  res.render('carloan');
});

app.get('/deleteaccount', (req, res) => {
  res.render('deleteaccount');
});

app.post('/login', (req, res) => {

});

function removeItemAll(arr) {
  var i = 0;
  while (i < arr.length) {
     
      arr.splice(i, 1);
    
      ++i;
  
  }
  return arr;
}

app.post('/deleteaccount', (req, res) => {
  removeItemAll(clients);
  res.render('login');
});

app.get('/pay_credit_card_bill', (req, res) => {
  res.render('pay_credit_card_bills');
});
app.get('/paycreditcardbill', (req, res) => {
  res.render('pay_credit_card_bills');
});


app.get('/receive_notifications', (req, res) => {
  res.render('receive_notification');
});
app.get('/Recieve_technical_issues', (req, res) => {
  const technicalIssues = [];
  res.render('Recieve_technical_issues', { technicalIssues });
});
app.get('/View_Reports', (req, res) => {
  const technicalIssues = [];
  res.render('View_Reports' );
});
app.get('/Accept_CC', (req, res) => {
  const technicalIssues = [];
  res.render('Accept_CC');
});
app.get('/Accept_Loan', (req, res) => {
  const technicalIssues = [];
  res.render('Accept_Loan',);
});

app.get('/Admin_receive_notifications', (req, res) => {
  const notifications = [];
  res.render('Admin_receive_notifications', { notifications });
});

app.get('/Admin_set_reminder', (req, res) => {
  res.render('Admin_set_reminder');
});

app.get('/credit_card_replacement', (req, res) => {
  
  const creditCardRequests = []; 
  
  res.render('credit_card_replacement', { creditCardRequests });
});


app.get('/search_clients', (req, res) => {
  res.render('search_clients');
});
app.get('/Bank_finance', (req, res) => {

});

app.get('/view_technical_report_admin', (req, res) => {
  res.render('view_technical_report_admin');
});



app.post('/search_clients', (req, res) => {
  const { clientName } = req.body;

  // Perform the search logic to retrieve the client based on the clientName
  const client = [];

  if (client) {
    // Retrieve the necessary data for the client
    const bankAccountTransactions = getBankAccountTransactions(client.id);
    const creditCardTransactions = getCreditCardTransactions(client.id);
    const creditCardPoints = getCreditCardPoints(client.id);

    res.render('search_clients', {
      client,
      bankAccountTransactions,
      creditCardTransactions,
      creditCardPoints
    });
  } else {
    res.render('search_clients', { client: null });
  }
});



app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});