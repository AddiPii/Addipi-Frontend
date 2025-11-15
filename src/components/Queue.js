import { React, useState } from "react";


export default function Queue(){
    const [ data, setData ] = useState(null);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(null);
    const [ lastFetch, setLastFetch ] = useState(null);

    const apiBase = process.env.QUEUE_SERVICE_API_URL || 'http://localhost:4000';

    const fetchQueue = async() => {
        setLoading(true);
        setError(null);
        try{
            const response = await fetch(`${apiBase}/queue`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const json = await response.json();
            setData(json);
            setLastFetch(new Date().toISOString());
        } catch (e){
            setError(e.message || String(e));
            setData(null);
        } finally{
            setLoading(false);
        }
    };

}