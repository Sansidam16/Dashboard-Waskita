import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

const MainLayout = ({ children }) => (
  <div className="flex h-screen bg-background">
    <Sidebar />
    <div className="flex-1 flex flex-col min-w-0">
      <Header />
      <main className="flex-1 overflow-y-auto p-6 bg-background">{children}</main>
      <Footer />
    </div>
  </div>
);

export default MainLayout;
