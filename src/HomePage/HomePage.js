import React, { useState } from 'react';
import './HomePage.css';
import Footer from '../Footer/Footer';


    
    const HomePage = () => {
        const [isLoading, setIsLoading] = useState(false);
        const [error, setError] = useState(null);
        const handleDownload = async () => {
            setIsLoading(true);
            setError(null);
            const url = document.getElementById("search-bar").value;
        
            try {
                const response = await fetch('https://web-production-4f6f.up.railway.app/downloadVideo', { // Updated with your Railway.app URL
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
            </div>
            {error && <p className="error">{error}</p>}
            <Footer />
        </div>
    );
}

export default HomePage;