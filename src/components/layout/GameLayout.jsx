import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';
import { caseData } from '../../data/caseData';
import './GameLayout.css';

const GameLayout = ({ children, activeItem, onNavigate, progress }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="game-layout">
      <Sidebar 
        caseId={caseData.id} 
        activeItem={activeItem} 
        onNavigate={onNavigate}
        isOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />
      
      <div className="game-main">
        <TopHeader 
          progress={progress !== undefined ? progress : 0} 
          onNavigate={onNavigate} 
          onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)}
        />
        
        <main className="game-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default GameLayout;
