import React, { useState } from 'react';
import './HomePage.css';
import Footer from '../Footer/Footer';


    
    const HomePage = () => {
        const [isLoading, setIsLoading] = useState(false);
        const [error, setError] = useState(null);
        const [showList,setShowList]=useState(false)
        const handleDownload = async () => {
            setIsLoading(true);
            setError(null);
            const url = document.getElementById("search-bar").value;
        
            try {
                const response = await fetch('https://web-production-4f6f.up.railway.app/downloadVideo', { // Updated with your Railway.app URL
                    // const response = await fetch('http://127.0.0.1:5000/downloadVideo', { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ url: url }),
                });
        
                if (response.ok) {
                    const blob = await response.blob();
                    const downloadUrl = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    
                    // Get the filename from the Content-Disposition header if available
                    const contentDisposition = response.headers.get('Content-Disposition');
                    let filename = 'download.mp4'; // Default filename
                    if (contentDisposition) {
                        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                        const matches = filenameRegex.exec(contentDisposition);
                        if (matches != null && matches[1]) {
                            filename = matches[1].replace(/['"]/g, '');
                        }
                    }
                    link.download = filename;
                    
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    window.URL.revokeObjectURL(downloadUrl);
                } else {
                    const errorData = await response.json();
                    setError(errorData.error || 'An error occurred');
                }
            } catch (error) {
                console.error('Error:', error);
                setError('An error occurred while downloading the video');
            } finally {
                setIsLoading(false);
            }
        };

        const [downloadProgress, setDownloadProgress] = useState(0);

        const handleMp3Download = async () => {
            setIsLoading(true);
            setError(null);
            setDownloadProgress(0);
            const url = document.getElementById("search-bar").value;
        
            try {
                const response = await fetch('https://web-production-4f6f.up.railway.app/downloadMp3', {
                // const response=await fetch('http://127.0.0.1:5000/downloadMp3', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ url: url }),
                });
        
                if (response.ok) {
                    const reader = response.body.getReader();
                    const contentLength = +response.headers.get('Content-Length');
                    let receivedLength = 0;
                    const chunks = [];
        
                    while(true) {
                        const {done, value} = await reader.read();
                        if (done) break;
                        chunks.push(value);
                        receivedLength += value.length;
                        setDownloadProgress(Math.round((receivedLength / contentLength) * 100));
                    }
        
                    const blob = new Blob(chunks, {type: 'audio/mpeg'});
                    const downloadUrl = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    
                    const contentDisposition = response.headers.get('Content-Disposition');
                    let filename = 'audio.mp3';
                    if (contentDisposition) {
                        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                        const matches = filenameRegex.exec(contentDisposition);
                        if (matches != null && matches[1]) {
                            filename = matches[1].replace(/['"]/g, '');
                        }
                    }
                    link.download = filename;
                    
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    window.URL.revokeObjectURL(downloadUrl);
                } else {
                    const errorData = await response.json();
                    setError(errorData.error || 'An error occurred');
                }
            } catch (error) {
                console.error('Error:', error);
                setError('An error occurred while downloading the audio');
            } finally {
                setIsLoading(false);
                setDownloadProgress(0);
            }
        };
    return (
        <div>
            <header className="header-content">
                <h1>Download YouTube Videos And Playlists</h1>
            </header>
            <div className="search-container">
                <input type="text" id="search-bar" placeholder="Paste YouTube video or playlist URL here..."/>
               
                <button id="download-btn" onClick={handleDownload} disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'Download'}
                </button>
                 
                <button id="download-btn" onClick={handleMp3Download} disabled={isLoading}>
    {isLoading ? `Processing... ${downloadProgress}%` : 'Download MP3'}
</button>

             {/* {showList&&(
                   <div>
                   Show List Of Formats available here 
                    
                    </div>
             )} */}
            </div>
            {error && <p className="error">{error}</p>}
            <Footer />
        </div>
    );
}

export default HomePage;