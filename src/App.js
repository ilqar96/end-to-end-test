import React, {useEffect, useState} from 'react';
import Ec from 'elliptic';
import {decrypte, encrypte} from "./actions/Crypto";

function App() {

    const [users, setUsers] = useState([
        {
            id:1,
            name: 'Alice',
            public_key: '',
        },
        {
            id:2,
            name: 'Bob',
            public_key: '',
        },
        {
            id:3,
            name: 'Kevin',
            public_key: '',
        },
    ])
    const [text, setText] = useState('');
    const [encText, setEncText] = useState('');
    const [decText, setDecText] = useState('');
    const [sender_id, setSender] = useState('');
    const [reciver_id, setReciver] = useState('');

    let ec = Ec.ec('curve25519');

    useEffect(() => {

        let usersArray = [];
        users.map((user, key) => {
            usersArray[key] = {
                ...user,
                keyPair: ec.genKeyPair(),
            }
        })

        setUsers(usersArray)


        // var A = ec.genKeyPair();
        // var B = ec.genKeyPair();
        //
        // var AB = ec.keyFromPublic(A.getPublic('hex'), 'hex').getPublic().mul(ec.keyFromPrivate(B.getPrivate('hex'), 'hex').getPrivate())
        // var BA = B.getPublic().mul(A.getPrivate())
        //
        // console.log(AB.getX().toString(16))
        // console.log(BA.getX().toString(16))
    }, [])


    function encrypteText() {
        if (sender_id == 0 || reciver_id == 0) {
            alert('sender or receiver not selected')
            return;
        }

        let senderUser = users.filter(user => user.id == sender_id)
        let receiverUser = users.filter(user => user.id == reciver_id)
        let senderKeyPair = senderUser[0].keyPair
        let receiverKeyPair = receiverUser[0].keyPair
        let pass  = senderKeyPair.derive(ec.keyFromPublic(receiverKeyPair.getPublic('hex'), 'hex').getPublic()).toString(16,64);

        let msg = text;

        let encText = encrypte(msg, pass)

        setEncText(encText);
    }

    function decrypteText() {
        if (sender_id == 0 || reciver_id == 0) {
            alert('sender or receiver not selected')
            return;
        }
        let senderUser = users.filter(user => user.id == sender_id)
        let receiverUser = users.filter(user => user.id == reciver_id)
        let senderKeyPair = senderUser[0].keyPair
        let receiverKeyPair = receiverUser[0].keyPair
        let pass  = receiverKeyPair.derive(ec.keyFromPublic(senderKeyPair.getPublic('hex'), 'hex').getPublic()).toString(16,64);

        let transitmessage = encText;

        let decText = decrypte(transitmessage, pass)

        setDecText(decText)
    }

    const testFunc = () => {
        let ec = Ec.ec('curve25519');
        let key1 = ec.genKeyPair();
        let key2 = ec.genKeyPair();

        let shared1 = key1.derive(key2.getPublic()).toString(16);
        let shared2 = key2.derive(key1.getPublic()).toString(16);

        const MESSAGE = "this is some random message...";

        let encrypteMessage = encrypte(MESSAGE, shared1);

        let decryptedMessage = decrypte(encrypteMessage, shared2);

        console.log(decryptedMessage)
    }


    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6">
                    <div className="form-group w-100 ">
                        <label>Sender</label>
                        <select
                            value={sender_id}
                            onChange={e => setSender(e.target.value)}
                            className="form-control w-100">
                            <option value=''>Please select</option>
                            {users.map((user, key) => (
                                <option value={user.id} key={key} data-public-key={user.public_key}>{user.name}</option>
                            ))}
                        </select>
                    </div>
                    <label htmlFor="text">Text</label>
                    <textarea className="form-control" name="text" id="" cols="30" rows="10"
                              onChange={e => setText(e.target.value)} value={text}/>
                    <button onClick={encrypteText} className="btn btn-success btn-md mt-2">Encrypte</button>
                    <br/>
                    <label htmlFor="encrypted_text">Encrypted</label>
                    <textarea className="form-control" name="encrypted_text" id="encrypted_text" cols="30" rows="10"
                              readOnly value={encText}/>
                </div>
                <div className="col-md-6">
                    <div className="form-group w-100 ">
                        <label htmlFor="exampleFormControlSelect1">Receiver</label>
                        <select
                            value={reciver_id}
                            onChange={e => setReciver(e.target.value)}
                            className="form-control w-100">
                            <option value=''>Please select</option>
                            {users.map((user, key) => (
                                <option value={user.id} key={key} data-public-key={user.public_key}>{user.name}</option>
                            ))}
                        </select>
                    </div>
                    <label htmlFor="encrypted">Encrypted {encText ? encText.length : '0'}</label>
                    <textarea className="form-control" name="encrypted" id="" cols="30" rows="10"
                              onChange={e => setEncText(e.target.value)} value={encText}/>
                    <button onClick={decrypteText} className="btn btn-danger btn-md mt-2">decrypted</button>

                    <br/>
                    <label htmlFor="decrypted_text">Dec</label>
                    <textarea className="form-control" name="decrypted_text" id="decrypted_text" cols="30" rows="10"
                              readOnly value={decText}/>
                </div>
            </div>

        </div>
    );
}

export default App;
