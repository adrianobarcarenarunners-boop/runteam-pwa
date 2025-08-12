import React, {useState, useEffect} from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Community(){
  const [text,setText] = useState('');
  const [posts,setPosts] = useState([]);
  useEffect(()=>{
    const q = query(collection(db,'posts'), orderBy('createdAt','desc'));
    return onSnapshot(q, snap => setPosts(snap.docs.map(d=>({id:d.id, ...d.data()}))));
  },[]);
  async function post(){
    if (!text) return;
    await addDoc(collection(db,'posts'), { text, createdAt: serverTimestamp() });
    setText('');
  }
  return (
    <div>
      <h3>Comunidade</h3>
      <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Compartilhe..."/>
      <div><button onClick={post}>Postar</button></div>
      <div style={{marginTop:12}}>
        {posts.map(p=>(
          <div key={p.id} style={{padding:8,borderBottom:'1px solid #eee'}}>
            <div>{p.text}</div>
            <div style={{fontSize:12,color:'#666'}}>{p.createdAt?.toDate ? p.createdAt.toDate().toLocaleString() : ''}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
