import Header from './Header';

const GameLayout = ({ 
  children, 
  showDashboard = true, 
  showLogout = false, 
  onLogout, 
  userData 
}) => {
  return (
    <div className="min-h-screen">
      <Header 
        showDashboard={showDashboard}
        showLogout={showLogout}
        onLogout={onLogout}
        userData={userData}
      />
      <main className="container mx-auto px-4 py-12">
        {children}
      </main>
    </div>
  );
};

export default GameLayout;
