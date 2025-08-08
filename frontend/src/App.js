import React, { useState } from 'react';
import Web3 from 'web3';
import { simpleStorageABI } from './abi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSpinner, FaWallet, FaDatabase, FaSync, FaPlug, FaSignOutAlt } from 'react-icons/fa';

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [storedValue, setStoredValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3Instance.eth.getAccounts();
        const userAccount = accounts[0];

        const contractInstance = new web3Instance.eth.Contract(simpleStorageABI, contractAddress);

        setAccount(userAccount);
        setContract(contractInstance);

        toast.success("Wallet connected!");
        fetchStoredValue(contractInstance);
      } catch (err) {
        toast.error("Connection failed.");
        console.error(err);
      }
    } else {
      toast.error("Please install MetaMask.");
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setContract(null);
    setStoredValue(null);
    toast.info("Wallet disconnected.");
  };

  const fetchStoredValue = async (contractRef = contract) => {
    try {
      const value = await contractRef.methods.get().call();
      setStoredValue(value.toString());
    } catch (err) {
      toast.error("Failed to fetch data.");
      console.error(err);
    }
  };

  const handleSet = async () => {
    if (contract && inputValue) {
      try {
        setLoading(true);
        await contract.methods.set(inputValue).send({ from: account });
        setInputValue('');
        toast.success("Value updated successfully!");
        fetchStoredValue();
      } catch (err) {
        toast.error("Transaction failed.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };


  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      position: 'relative',
      overflow: 'hidden'
    },
    backgroundOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)',
      animation: 'float 6s ease-in-out infinite'
    },
    mainContent: {
      position: 'relative',
      zIndex: 10,
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem'
    },
    headerIcon: {
      width: '80px',
      height: '80px',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 2rem',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
      animation: 'pulse 2s infinite'
    },
    title: {
      fontSize: '4rem',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #667eea, #764ba2, #f093fb)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '1rem',
      textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
    },
    subtitle: {
      fontSize: '1.2rem',
      color: 'rgba(255,255,255,0.8)',
      maxWidth: '600px',
      margin: '0 auto',
      lineHeight: 1.6
    },
    card: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '24px',
      padding: '2rem',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
      transition: 'all 0.3s ease',
      marginBottom: '2rem'
    },
    connectCard: {
      textAlign: 'center',
      padding: '3rem'
    },
    connectIcon: {
      fontSize: '4rem',
      color: '#667eea',
      marginBottom: '2rem',
      animation: 'bounce 2s infinite'
    },
    connectTitle: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '1rem'
    },
    connectSubtitle: {
      fontSize: '1.1rem',
      color: 'rgba(255,255,255,0.7)',
      marginBottom: '2rem'
    },
    primaryButton: {
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      border: 'none',
      padding: '1rem 2rem',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      borderRadius: '16px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      margin: '0 auto'
    },
    secondaryButton: {
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'rgba(255,255,255,0.8)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      margin: '0 auto'
    },
    accountRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1rem'
    },
    accountInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    accountIcon: {
      width: '48px',
      height: '48px',
      background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '1.2rem'
    },
    accountText: {
      color: 'rgba(255,255,255,0.6)',
      fontSize: '0.9rem',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '0.25rem'
    },
    accountAddress: {
      color: 'white',
      fontFamily: 'monospace',
      fontSize: '1.1rem',
      fontWeight: 'bold'
    },
    disconnectButton: {
      background: 'rgba(239, 68, 68, 0.2)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      color: '#fca5a5',
      padding: '0.75rem 1.5rem',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    valueDisplay: {
      textAlign: 'center'
    },
    valueTitle: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem'
    },
    valueCircle: {
      width: '120px',
      height: '120px',
      background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 2rem',
      boxShadow: '0 20px 40px rgba(79, 172, 254, 0.3)',
      position: 'relative',
      animation: 'glow 2s infinite alternate'
    },
    valueText: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: 'white'
    },
    updateSection: {
      textAlign: 'center'
    },
    updateTitle: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '2rem'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      maxWidth: '400px',
      margin: '0 auto'
    },
    input: {
      width: '100%',
      padding: '1rem 1.5rem',
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '16px',
      color: 'white',
      fontSize: '1.1rem',
      textAlign: 'center',
      outline: 'none',
      transition: 'all 0.3s ease'
    },
    updateButton: {
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      border: 'none',
      padding: '1rem 2rem',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      borderRadius: '16px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      width: '100%'
    },
    footer: {
      textAlign: 'center',
      marginTop: '3rem',
      color: 'rgba(255,255,255,0.6)',
      fontSize: '1rem'
    },
    '@keyframes': {
      float: {
        '0%, 100%': { transform: 'translateY(0px)' },
        '50%': { transform: 'translateY(-20px)' }
      },
      pulse: {
        '0%': { transform: 'scale(1)' },
        '50%': { transform: 'scale(1.05)' },
        '100%': { transform: 'scale(1)' }
      },
      bounce: {
        '0%, 20%, 53%, 80%, 100%': { transform: 'translateY(0)' },
        '40%, 43%': { transform: 'translateY(-10px)' },
        '70%': { transform: 'translateY(-5px)' }
      },
      glow: {
        from: { boxShadow: '0 20px 40px rgba(79, 172, 254, 0.3)' },
        to: { boxShadow: '0 25px 50px rgba(79, 172, 254, 0.6)' }
      },
      spin: {
        from: { transform: 'rotate(0deg)' },
        to: { transform: 'rotate(360deg)' }
      }
    }
  };

  // Add hover effects
  const handleMouseEnter = (e, hoverStyle) => {
    Object.assign(e.target.style, hoverStyle);
  };

  const handleMouseLeave = (e, originalStyle) => {
    Object.assign(e.target.style, originalStyle);
  };

  return (
    <div style={styles.container}>
      <ToastContainer 
        position="top-right"
        theme="dark"
        toastStyle={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      />
      
      <div style={styles.backgroundOverlay}></div>

      <div style={styles.mainContent}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerIcon}>
            <FaDatabase style={{ color: 'white', fontSize: '2rem' }} />
          </div>
          <h1 style={styles.title}>Simple Storage</h1>
          <p style={styles.subtitle}>
            A decentralized application for storing and retrieving values on the blockchain
          </p>
        </div>

        {/* Main Content */}
        {!account ? (
          /* Connection Card */
          <div style={styles.card}>
            <div style={styles.connectCard}>
              <FaWallet style={styles.connectIcon} />
              <h2 style={styles.connectTitle}>Connect Your Wallet</h2>
              <p style={styles.connectSubtitle}>
                Connect your MetaMask wallet to interact with the smart contract
              </p>
              <button
                style={styles.primaryButton}
                onClick={connectWallet}
                onMouseEnter={(e) => handleMouseEnter(e, { transform: 'scale(1.05)' })}
                onMouseLeave={(e) => handleMouseLeave(e, { transform: 'scale(1)' })}
              >
                <FaPlug />
                Connect MetaMask
              </button>
            </div>
          </div>
        ) : (
          /* Dashboard */
          <div>
            {/* Account Info */}
            <div style={styles.card}>
              <div style={styles.accountRow}>
                <div style={styles.accountInfo}>
                  <div style={styles.accountIcon}>
                    <FaWallet />
                  </div>
                  <div>
                    <p style={styles.accountText}>Connected Account</p>
                    <p style={styles.accountAddress}>
                      {account.slice(0, 8)}...{account.slice(-8)}
                    </p>
                  </div>
                </div>
                <button
                  style={styles.disconnectButton}
                  onClick={disconnectWallet}
                  onMouseEnter={(e) => handleMouseEnter(e, { background: 'rgba(239, 68, 68, 0.3)' })}
                  onMouseLeave={(e) => handleMouseLeave(e, { background: 'rgba(239, 68, 68, 0.2)' })}
                >
                  <FaSignOutAlt />
                  <span>Disconnect</span>
                </button>
              </div>
            </div>

            {/* Storage Value Display */}
            <div style={styles.card}>
              <div style={styles.valueDisplay}>
                <h3 style={styles.valueTitle}>
                  <FaDatabase style={{ color: '#4facfe' }} />
                  Stored Value
                </h3>
                <div style={styles.valueCircle}>
                  <span style={styles.valueText}>
                    {storedValue !== null ? storedValue : '?'}
                  </span>
                </div>
                <button
                  style={styles.secondaryButton}
                  onClick={() => fetchStoredValue()}
                  onMouseEnter={(e) => handleMouseEnter(e, { background: 'rgba(255, 255, 255, 0.2)' })}
                  onMouseLeave={(e) => handleMouseLeave(e, { background: 'rgba(255, 255, 255, 0.1)' })}
                >
                  <FaSync />
                  <span>Refresh Data</span>
                </button>
              </div>
            </div>

            {/* Update Value Card */}
            <div style={styles.card}>
              <div style={styles.updateSection}>
                <h3 style={styles.updateTitle}>Update Storage Value</h3>
                <div style={styles.inputGroup}>
                  <input
                    type="number"
                    placeholder="Enter new value"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    style={styles.input}
                    onFocus={(e) => handleMouseEnter(e, { border: '1px solid #667eea' })}
                    onBlur={(e) => handleMouseLeave(e, { border: '1px solid rgba(255, 255, 255, 0.2)' })}
                  />
                  <button
                    onClick={handleSet}
                    disabled={loading || !inputValue}
                    style={{
                      ...styles.updateButton,
                      opacity: loading || !inputValue ? 0.5 : 1,
                      cursor: loading || !inputValue ? 'not-allowed' : 'pointer'
                    }}
                    onMouseEnter={(e) => !loading && !e.target.disabled && handleMouseEnter(e, { transform: 'scale(1.05)' })}
                    onMouseLeave={(e) => !loading && !e.target.disabled && handleMouseLeave(e, { transform: 'scale(1)' })}
                  >
                    {loading ? (
                      <>
                        <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <span>Update Value</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={styles.footer}>
          <p>Built with ❤️ using Web3.js & React</p>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
          40%, 43% { transform: translateY(-10px); }
          70% { transform: translateY(-5px); }
        }
        @keyframes glow {
          from { box-shadow: 0 20px 40px rgba(79, 172, 254, 0.3); }
          to { box-shadow: 0 25px 50px rgba(79, 172, 254, 0.6); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
        @media (max-width: 768px) {
          .inputGroup {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;