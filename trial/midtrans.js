
    //TRANSAKSI UNTUK MIDTRANS
    var MidTrans = require('midtrans-payment');
    var config = {
        //production
        client_key: "Mid-client-nE9_gQuLfbwlVSLz",//sandbox SB-Mid-client-J2zmEZXw_z3NyLVh
        server_key: "Mid-server-wgQWi0kh_BqlUdZD7aSJ3u4B",//sandbox SB-Mid-server-qCIqRR8vzeP2Wkl0DAVPD-rj
        mode: "production"    // you can set to sandbox or production. Default is sandbox if empty.

        //sandbox
        // client_key: "Msandbox SB-Mid-client-J2zmEZXw_z3NyLVh",//
        // server_key: "sandbox SB-Mid-server-qCIqRR8vzeP2Wkl0DAVPD-rj",//
        // mode: ""    // you can set to sandbox or production. Default is sandbox if empty.
        
    };

    //Midtrans Transaction
    var mdt = new MidTrans(config);
    const mdtData = new Promise((resolve, reject) => {
        mdt.type('snap').action('transactions')
            .transaction_details(`Prop-${newTransactionId}`,totalPrice)
            .item_details( req.body.name, req.body.price, req.body.qty, properties.type)     
            .customer_details( user.name, user.name, req.body.email, user.phone_number)   
            .send(function(response) {
                resolve(response.body)
            });
    })
    const mdtResponse = await mdtData

        let transaction = new Transactions({
            name: req.body.name,
            transaction_id: newTransactionId,
            email: req.body.email,
            qty:req.body.qty,
            price:req.body.price,
            total:totalPrice,
            token:mdtResponse.token,
            redirect_url:mdtResponse.redirect_url
            }
        );
        transaction = await transaction.save();
        res.send(mdtResponse.redirect_url)