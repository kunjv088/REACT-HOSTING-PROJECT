import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebaseConfig'; 
import { Link, useNavigate } from 'react-router-dom';  
import "./SignUp.css"

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const neviget = useNavigate();


    useEffect(() => {
        setName('');
        setEmail('');
        setPassword('');

    }, []);
    const handleGooglelogin = async () => {
        await signInWithPopup(auth , provider)
        .then(user => {
            console.log(user);
            neviget('/app');
            
        })
    }

    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log("User  signed up:", userCredential);
                setEmail('');
                setPassword('');
                setName('');
                
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    return (
        <div id='kunj'>
            <h2 id='s'>SIGN UP</h2>
            <input id='s1' style={{width:'85%'}} type="text" placeholder=" Name" onChange={(e) => setName(e.target.value)}/>
            <input  id='s3'
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input  id='s3'
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button id='s4' onClick={handleSignUp}>Sign Up</button>
            {error && <p style={{color: 'red'}}>{error}</p>}
            
            <p  id='s5'> Already have an account ?
             <Link to="/"> Login</Link>
            </p>
            <br />
            <div className="hr">
                <div className="hr1"><hr /></div>
                <div className="div">&nbsp;OR&nbsp;</div>
                <div className="hr1"><hr /></div>
            </div>
            <p>Login with</p> 
            <a   onClick={handleGooglelogin}><i class="fa-brands fa-google"></i></a>
        </div>
    );
};

export default SignUp;