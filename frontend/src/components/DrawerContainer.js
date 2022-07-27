import '../style-sheets/DrawerContainer.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faMagnifyingGlass, faUsers, faEnvelope, faGear } from '@fortawesome/free-solid-svg-icons';

const DrawerContainer = () => {
  return (
    <div className='drawer-container'>
        <h1 className='logo'>logo</h1>
        <div className='home-tab-container'>
          <div className={'home-tab active-tab'}>
            <FontAwesomeIcon icon={faHouse} className='font-awesome-house'/>
            <h3 className='home-tab-text'>Home</h3>
          </div>
        </div>
        <FontAwesomeIcon icon={faMagnifyingGlass} className='font-awesome-magnifier'/>
        <h3 className='sponsor-tab-text'>Find a Sponsor</h3>
        <FontAwesomeIcon icon={faUsers} className='font-awesome-users'/>
        <h3 className='groups-tab-text'>Groups</h3>
        <FontAwesomeIcon icon={faEnvelope} className='font-awesome-mail'/>
        <h3 className='messages-tab-text'>Messages</h3>
        <div className='drawer-container-line'></div>
        <FontAwesomeIcon icon={faGear} className='font-awesome-gear'/>
        <h3 className='settings-tab'>Settings</h3>
        <div className='improve-search'>
          <h1 className='improve-search-header'>Improve Your Matches</h1>
          <p className='improve-search-text'>Increasing your search radius can improve the number of matches you recieve, would you like to improve your search radius?</p>
          <button className='no-button'>No</button>
          <button className='yes-button'>Yes</button>
        </div>
      </div>
  )
}

export default DrawerContainer;