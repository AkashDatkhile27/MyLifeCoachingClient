import React from 'react'   
import { Video, FileText, Edit2, Trash2,Clock,Plus} from 'lucide-react';
import '../../../css/adminDashboard.css';

const SessionManagementTab = ({ sessions, onEdit, onDelete, onCreateSession }) => (
    <>
      <div className="table-container">
        <table className="sa-table">
          <thead>
            <tr>
              <th width="80">Day</th>
              <th>Details & Content</th>
              <th width="120">Type</th>
              <th align="right" width="100">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map(s => (
              <tr key={s._id}>
                <td data-label="Day" className="day-cell">{s.dayNumber}</td>
                <td data-label="Details">
                  <div className="session-title">{s.title}</div>
                  
                  {/* FULL CONTENT DISPLAY */}
                  <ul className="session-points">
                    {s.contextPoints && s.contextPoints.length > 0 ? (
                      s.contextPoints.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))
                    ) : (
                      <li>No description available.</li>
                    )}
                  </ul>
                  
                  {s.mediaUrl && (
                      <div style={{marginTop:8, fontSize:'0.75rem', color:'#64748b', display:'flex', alignItems:'center', gap:6}}>
                          <Video size={12}/> Media Attached
                      </div>
                  )}
                </td>
                <td data-label="Type">
                  <span className="type-badge">
                    {s.type === 'Recorded' ? <Video size={12}/> : <FileText size={12}/>} 
                    {s.type}
                  </span>
                </td>
                <td data-label="Actions" className="actions-cell">
                   <div style={{display:'flex', justifyContent:'flex-end', gap:8}}>
                       <button onClick={() => onEdit(s)} className="icon-btn" title="Edit"><Edit2 size={18}/></button>
                       <button onClick={() => onDelete(s._id)} className="icon-btn-danger" title="Delete"><Trash2 size={18}/></button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Floating Action Button for New Session */}
      <div className="fab-container">
         <button className="fab" onClick={onCreateSession}>
            <Plus size={24} /> <span>Add Session</span>
         </button>
      </div>
    </>
);

export default SessionManagementTab
