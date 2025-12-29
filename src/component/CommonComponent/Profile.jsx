
import { useState, useRef,useEffect} from 'react';

import { Mail, EyeOff, Eye, Phone, Camera, Key } from 'lucide-react';
import {getInitials} from '../../utils/getUserSessionStatusAndInitials';
import '../../css/adminDashboard.css';
const Profile =({ user, onUpdate, onPasswordChange }) => {
   const [formData, setFormData] = useState({
    name: user?.Name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    profilePicture: user?.profilePicture || null 
  });
  const [passData, setPassData] = useState({  new: '', confirm: '' });
  const [preview, setPreview] = useState(user?.profilePicture);
  const fileInputRef = useRef(null);
 // State for toggling password visibility
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  useEffect(() => {
     if(user) {
         setFormData({
            name: user.Name,
            email: user.email,
            phone: user.phone || '',
            profilePicture:   user.profilePicture || null
         });
         setPreview(user.profilePicture);
     }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a FileReader to read the file
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const image = new Image();
        image.onload = () => {
          // Resize logic
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 500; // Resize to max 500px width/height
          let width = image.width;
          let height = image.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(image, 0, 0, width, height);

          // Convert to Base64 with compression (JPEG, 0.7 quality)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          
          setFormData(prev => ({ ...prev, profilePicture: dataUrl }));
          setPreview(dataUrl);
        };
        image.src = readerEvent.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="sa-grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))'}}>
      {/* Profile Details Card */}
      <div className="sa-card-profile">
        <div className="card-header-row">
           <div className="user-info">
              {/* Avatar with Camera Icon Overlay */}
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()} style={{width: 48, height: 48, position: 'relative'}}>
                  {preview ? (
                     <img src={preview} alt="Profile" className="w-full h-full object-cover rounded-full" style={{width: '100%', height: '100%', borderRadius: '50%'}} />
                  ) : (
                     <div className="avatar-initials" style={{width: '100%', height: '100%', fontSize: '1rem'}}>
                        {getInitials(user?.Name)}
                     </div>
                  )}
                  <div style={{
                      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', borderRadius: '50%', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      opacity: 0, transition: 'opacity 0.2s'
                  }} className="group-hover:opacity-100">
                     <Camera size={20} color="#fff" />
                  </div>
                  <input ref={fileInputRef} type="file" className="hidden" style={{display: 'none'}} accept="image/*" onChange={handleFileChange} />
              </div>

              <div>
                <h3 style={{fontSize: '1.2rem'}}>{user?.Name}</h3>
                <p>{user?.role}</p>
              </div>
           </div>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); onUpdate(formData); }}>
           <div className="formgroup">
              <label style={{color: '#888', fontSize: '0.85rem', marginBottom: 6, display: 'block'}}>Email Address</label>
              <div style={{display:'flex', alignItems:'center', background:'#000', border:'1px solid #333', borderRadius:8, padding:'0 12px'}}>
                  <Mail size={16} color="#666"/>
                  <input className="input opacity-50 cursor-not-allowed" readOnly style={{border:'none', margin:0}} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
           </div>
           <div className="formgroup" style={{marginTop: 16}}>
              <label style={{color: '#888', fontSize: '0.85rem', marginBottom: 6, display: 'block'}}>Phone Number</label>
              <div style={{display:'flex', alignItems:'center', background:'#000', border:'1px solid #333', borderRadius:8, padding:'0 12px'}}>
                  <Phone size={16} color="#666"/>
                  <input className="input" style={{border:'none', margin:0}} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
           </div>
           <button type="submit" className="btn btnprimary full-width" style={{marginTop: 24}}>Update Profile</button>
        </form>
      </div>

      {/* Change Password Card */}
      <div className="sa-card-profile">
        <div className="card-header-row">
            <h3 style={{fontSize: '1.1rem', color: '#fff', display:'flex', alignItems:'center', gap: 10}}>
               <div style={{background: 'rgba(255,255,255,0.1)', padding: 8, borderRadius: 8}}>
                  <Key size={18} />
               </div>
               Change Password
            </h3>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onPasswordChange(passData); }}>
          {/* New Password Field */}
           <div style={{position: 'relative', marginBottom: 12}}>
               <input 
                   className="input" 
                   type={showNewPass ? "text" : "password"} 
                   placeholder="New Password" 
                   value={passData.new} 
                   onChange={e => setPassData({...passData, new: e.target.value})} 
                   style={{paddingRight: 40}}
               />
               <button 
                   type="button"
                   onClick={() => setShowNewPass(!showNewPass)}
                   style={{
                       position: 'absolute', 
                       right: 12, 
                       top: '50%', 
                       transform: 'translateY(-50%)', 
                       background: 'transparent', 
                       border: 'none', 
                       cursor: 'pointer',
                       color: '#666',
                       display: 'flex',
                       alignItems: 'center'
                   }}
               >
                   {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
               </button>
           </div>

           {/* Confirm Password Field */}
           <div style={{position: 'relative'}}>
               <input 
                   className="input" 
                   type={showConfirmPass ? "text" : "password"} 
                   placeholder="Confirm New Password" 
                   value={passData.confirm} 
                   onChange={e => setPassData({...passData, confirm: e.target.value})}
                   style={{paddingRight: 40}}
               />
               <button 
                   type="button"
                   onClick={() => setShowConfirmPass(!showConfirmPass)}
                   style={{
                       position: 'absolute', 
                       right: 12, 
                       top: '50%', 
                       transform: 'translateY(-50%)', 
                       background: 'transparent', 
                       border: 'none', 
                       cursor: 'pointer',
                       color: '#666',
                       display: 'flex',
                       alignItems: 'center'
                   }}
               >
                   {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
               </button>
           </div>
          <button type="submit" className="btn btn-outline full-width" style={{marginTop: 12}}>Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default Profile
