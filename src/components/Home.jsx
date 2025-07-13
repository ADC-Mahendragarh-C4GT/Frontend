import React, { useState } from 'react';
import Header from './header';

export default function Home() {
  
return (
    <>
    <Header className="header-fixed" />
    <div className="home-container">

        <main className="main-scrollable p-4 pt-32">
            <h1 className="text-2xl font-bold">Welcome to the Home Page</h1>
            <p className="mt-2">This is the main content area.</p>
        </main>
        <style>{`
        
            .header-fixed {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                z-index: 100;
                background: white;
            }
            .main-scrollable {
                margin-top: 64px;
                overflow-y: auto;
                height: calc(100vh - 64px);
            }
        `}</style>
    </div>
    </>
);
}
