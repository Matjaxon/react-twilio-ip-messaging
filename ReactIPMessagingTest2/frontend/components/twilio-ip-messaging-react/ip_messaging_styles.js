const Styles = {
  activeChatContainer: {
    display: 'flex',
    border: '1px solid #0d122b',
    width: '450px',
    fontFamily: 'helvetica, sans-serif',
    boxSizing: 'border-box'
  },
  activeChannelManager: {
    display: 'flex',
    flexDirection: 'column',
    width: '125px',
    backgroundColor: '#f6f6f6'
  },
  channelNamesContainer: {
    minHeight: '90%',
    overflowY: 'scroll',
    overflowX: 'hidden'
  },
  channelManagerChannelName: {
    display: 'flex',
    padding: '5px',
    width: '125px',
    borderBottom: '1px solid #e6e6e6',
    borderLeft: '0px solid transparent',
    fontSize: '0.7em',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    overflow: 'hidden',
    boxSizing: 'border-box',
    whiteSpace: 'nowrap',
    textTransform: 'lowercase',
    fontWeight: 'normal'
  },
  activeChannelName: {
    fontWeight: 'bold'
  }
};

export default Styles;
