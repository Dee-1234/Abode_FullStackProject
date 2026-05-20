import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Image, Link2, Type, Send, AlertCircle, Hash, ChevronDown } from 'lucide-react';
import api from '../services/api';

const CreatePost = () => {
    // State properties aligned with backend Contracts
    const [roomName, setRoomName] = useState(''); // Initialized empty for placeholder mechanics
    const [postName, setPostName] = useState('');
    const [url, setUrl] = useState('');
    const [description, setDescription] = useState('');
    
    // Dynamic Room Engine States
    const [rooms, setRooms] = useState([]);
    const [roomsLoading, setRoomsLoading] = useState(true);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Pull all existing rooms from the database context on initialization
    useEffect(() => {
        const fetchAvailableRooms = async () => {
            try {
                const response = await api.get('/room');
                if (response.data && Array.isArray(response.data)) {
                    setRooms(response.data);
                }
            } catch (err) {
                console.error("Failed to collect database communities:", err);
                setError("Could not resolve community list from server environment.");
            } finally {
                setRoomsLoading(false);
            }
        };

        fetchAvailableRooms();
    }, []);

    const handleCreatePost = async (e) => {
        e.preventDefault();
        
        // Strict Validation Checks
        if (!postName.trim() || !description.trim() || !roomName.trim()) {
            setError('Please choose a valid Community, and fill out both Title and Description fields.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Dispatches verified payload vectors back to Spring Boot
            const response = await api.post('/posts', { 
                roomName, 
                postName, 
                url, 
                description 
            });
            
            if (response.status === 201 || response.status === 200) {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to dispatch post back to the cluster.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="composer-container">
            <style>{`
                .composer-container { min-height: 100vh; padding: 110px 20px 40px 20px; display: flex; justify-content: center; background: #020617; position: relative; }
                .ambient-glow { position: absolute; width: 600px; height: 600px; background: rgba(37, 99, 235, 0.03); border-radius: 50%; filter: blur(140px); pointer-events: none; top: 10%; right: 10%; }
                .composer-card { width: 100%; max-width: 740px; padding: 35px; border-radius: 24px; height: fit-content; z-index: 10; }
                .tab-header { display: flex; gap: 20px; border-bottom: 1px solid #1e293b; margin-bottom: 30px; padding-bottom: 12px; }
                .tab-btn { background: transparent; border: none; color: #64748b; font-weight: 700; font-size: 14px; display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 4px 0; position: relative; }
                .tab-btn.active { color: #3b82f6; }
                .tab-btn.active::after { content: ''; position: absolute; bottom: -13px; left: 0; right: 0; height: 2px; background: #3b82f6; box-shadow: 0 0 10px #3b82f6; }
                
                .meta-row { display: flex; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
                .meta-input-container { flex: 1; min-width: 240px; display: flex; align-items: center; background: #0b1329; border: 1px solid #1e293b; border-radius: 12px; padding: 4px 14px; position: relative; }
                .meta-icon { color: #475569; margin-right: 8px; flex-shrink: 0; }
                
                /* Dropdown UI Option Styling Architecture */
                .meta-select { 
                    background: transparent; 
                    border: none; 
                    outline: none; 
                    color: #f8fafc; 
                    font-size: 14px; 
                    width: 100%; 
                    padding: 10px 24px 10px 0; 
                    appearance: none; 
                    -webkit-appearance: none;
                    cursor: pointer;
                    font-family: inherit;
                }
                .meta-select:invalid || .meta-select option[value=""] {
                    color: #475569;
                }
                .meta-select option {
                    background: #0f172a;
                    color: #f8fafc;
                    padding: 12px;
                }
                .select-arrow { position: absolute; right: 14px; color: #475569; pointer-events: none; display: flex; }

                .meta-input { background: transparent; border: none; outline: none; color: #f8fafc; font-size: 14px; width: 100%; padding: 10px 0; }
                .composer-title-input { font-size: 22px; font-weight: 700; padding: 16px; margin-bottom: 20px; }
                .composer-text-area { font-size: 15px; padding: 18px; min-height: 200px; resize: vertical; line-height: 1.6; }
                .error-message { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); color: #ef4444; padding: 12px 16px; border-radius: 12px; font-size: 13px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
                .actions-shelf { display: flex; justify-content: flex-end; padding-top: 10px; }
            `}</style>

            <div className="ambient-glow" />

            <motion.div 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="composer-card glass-panel"
            >
                <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '800', letterSpacing: '-0.02em' }}>Create a post</h2>
                <p style={{ margin: '0 0 25px 0', color: '#64748b', fontSize: '14px' }}>Share updates, code concepts, or links with the neighborhood</p>

                {/* Post Type Selector tabs */}
                <div className="tab-header">
                    <button className="tab-btn active" type="button"><Type size={16} /> Post Text & Links</button>
                    <button className="tab-btn" disabled style={{ opacity: 0.4, cursor: 'not-allowed' }} type="button"><Image size={16} /> Media</button>
                </div>

                {error && (
                    <div className="error-message">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleCreatePost}>
                    {/* Secondary Context Meta Inputs (Dynamic Selector + Link URL) */}
                    <div className="meta-row">
                        <div className="meta-input-container">
                            <Hash size={16} className="meta-icon" />
                            <select 
                                required
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                                className="meta-select"
                                disabled={roomsLoading}
                            >
                                {roomsLoading ? (
                                    <option value="">Syncing communities...</option>
                                ) : (
                                    <>
                                        {/* Pure Dropdown Placeholder Setup */}
                                        <option value="" disabled hidden>
                                            Choose a community...
                                        </option>
                                        
                                        {rooms.length === 0 ? (
                                            <option value="" disabled>No communities found. Create one first!</option>
                                        ) : (
                                            rooms.map((room) => (
                                                <option key={room.id} value={room.name}>
                                                    {room.name}
                                                </option>
                                            ))
                                        )}
                                    </>
                                )}
                            </select>
                            <div className="select-arrow">
                                <ChevronDown size={14} />
                            </div>
                        </div>
                        
                        <div className="meta-input-container">
                            <Link2 size={16} className="meta-icon" />
                            <input 
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="Source link URL (optional)"
                                className="meta-input"
                            />
                        </div>
                    </div>

                    {/* Post Title Heading field */}
                    <input 
                        type="text"
                        required
                        maxLength={100}
                        value={postName}
                        onChange={(e) => setPostName(e.target.value)}
                        placeholder="An interesting title for your post..."
                        className="composer-title-input cyber-input"
                    />

                    {/* Extended content textbox */}
                    <textarea 
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="What's on your mind? Markdown formatting supported implicitly..."
                        className="composer-text-area cyber-input"
                    />

                    {/* Footer Control Bar */}
                    <div className="actions-shelf">
                        <button type="submit" className="cyber-btn" style={{ padding: '12px 24px', fontSize: '14px' }} disabled={loading || rooms.length === 0 || !roomName}>
                            {loading ? (
                                <div style={{ width: '18px', height: '18px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                            ) : (
                                <>Publish Post <Send size={15} /></>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default CreatePost;