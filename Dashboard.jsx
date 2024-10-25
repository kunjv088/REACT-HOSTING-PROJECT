import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, getDocs, collection, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import './Dashboard.css';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [carBrand, setCarBrand] = useState("");  
  const [carName, setCarName] = useState("");  
  const [carYear, setCarYear] = useState("");  
  const [carPrice, setCarPrice] = useState(""); 
  const [record, setRecord] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log(currentUser);
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        console.log(userDoc.data());
      }
    };

    fetchUser();
  }, [user]);

  const fetchData = async () => {
    const data = await getDocs(collection(db, "Cars")); 
    const newData = data.docs.map((item) => ({ docId: item.id, ...item.data() }));
    setRecord(newData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addData = async () => {
    if (editIndex === null) {
      await addDoc(collection(db, "Cars"), { carBrand, carName, carYear, carPrice });
    } else {
      await updateDoc(doc(db, "Cars", editIndex), { carBrand, carName, carYear, carPrice });
      setEditIndex(null); 
    }
    // Clear input fields
    setCarBrand("");
    setCarName("");
    setCarYear("");
    setCarPrice("");
    fetchData();
  };

  const deleteData = async (docId) => {
    await deleteDoc(doc(db, "Cars", docId)); 
    fetchData();
  };

  const editData = (docId) => {
    const singleData = record.find((item) => item.docId === docId);
    setCarBrand(singleData.carBrand);
    setCarName(singleData.carName);
    setCarYear(singleData.carYear);
    setCarPrice(singleData.carPrice);
    setEditIndex(docId);
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-greeting">CAR STORE</h1>

      <select style={{width : '99.50%'}} value={carBrand} onChange={(e) => setCarBrand(e.target.value)}>
        <option value="">Select Car Brand</option>
        <option value="Toyota">Toyota</option>
        <option value="Honda">Honda</option>
        <option value="Ford">Ford</option>
        <option value="BMW">BMW</option>
        <option value="Mercedes">Mercedes</option>
      </select>

      
      <input
        type="text"
        placeholder="Car Name"
        value={carName}
        onChange={(e) => setCarName(e.target.value)}
      />
      

      <input
        type="text"
        placeholder="Car Year"
        value={carYear}
        onChange={(e) => setCarYear(e.target.value)}
      />


      <input
        type="text"
        placeholder="Car Price"
        value={carPrice}
        onChange={(e) => setCarPrice(e.target.value)}
      />
      

      <button onClick={addData}>{editIndex === null ? "Add Car" : "Update Car"}</button>


      <ul>
        {record.map((e) => (
          <table key={e.docId}>
            <tr>
              <th>CAR BRAND</th>
              <th>CAR NAME</th>
              <th>CAR YEAR</th>
              <th>CAR PRICE</th>
              <th>ACTION</th>
            </tr> <br />
            <tr>
              <td>{e.carBrand}</td>
              <td> {e.carName}</td>
              <td>{e.carYear}</td>
              <td>{e.carPrice}</td>
              <td>
              <button onClick={() => editData(e.docId)}>Edit</button>
              <button onClick={() => deleteData(e.docId)}>Delete</button>
              </td>
            </tr>
                
            
          </table>
        ))}
      </ul>
    </div>
  );
}
