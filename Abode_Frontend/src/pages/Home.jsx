import { useEffect, useState } from 'react';
import api from '../services/api';
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share2, MoreHorizontal, Send, X, AlertCircle } from 'lucide-react';

const Home = ({ isModalOpen, setIsModalOpen }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [activePostCommentId, setActivePostCommentId] = useState(null);
    const [commentsMap, setCommentsMap] = useState({}); 
    const [newCommentTextsMap, setNewCommentTextsMap] = useState({}); // Isolated per post
    const [commentsLoading, setCommentsLoading] = useState(false);

    const [newRoomName, setNewRoomName] = useState('');
    const [newRoomDescription, setNewRoomDescription] = useState('');
    const [modalError, setModalError] = useState('');
    const [modalLoading, setModalLoading] = useState(false);

    const fetchPosts = () => {
        api.get('/posts')
        .then(response => {
            setPosts(response.data);
            setLoading(false);
        })
        .catch(error => {
            console.error("Error fetching posts:", error);
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleVote = async (postId, type) => {
        try {
            await api.post('/votes', { voteType: type, postId: postId });
            setPosts(prevPosts =>
                prevPosts.map(post => {
                    if (post.id === postId) {
                        const currentCount = post.voteCount || 0;
                        return {
                            ...post,
                            voteCount: type === 'UPVOTE' ? currentCount + 1 : currentCount - 1
                        };
                    }
                    return post;
                })
            );
        } catch (err) {
            console.error("Error casting vote:", err);
        }
    };

    const fetchComments = async (postId) => {
        setCommentsLoading(true);
        try {
            const response = await api.get(`/comments/by-post/${postId}`);
            setCommentsMap(prev => ({ ...prev, [postId]: response.data }));
        } catch (err) {
            console.error("Error fetching comments:", err);
        } finally {
            setCommentsLoading(false);
        }
    };

    const handleToggleComments = (postId) => {
        if (activePostCommentId === postId) {
            setActivePostCommentId(null);
        } else {
            setActivePostCommentId(postId);
            // Clear or initialize string tracking for this specific post
            setNewCommentTextsMap(prev => ({ ...prev, [postId]: '' }));
            fetchComments(postId);
        }
    };

    const handleCommentTextChange = (postId, text) => {
        setNewCommentTextsMap(prev => ({ ...prev, [postId]: text }));
    };

    const handleCommentSubmit = async (e, postId) => {
        e.preventDefault();
        const currentCommentText = newCommentTextsMap[postId] || '';
        if (!currentCommentText.trim()) return;

        try {
            const response = await api.post('/comments', {
                text: currentCommentText.trim(),
                postId: postId
            });

            if (response.status === 201 || response.status === 200) {
                // Clear state field for just this post
                setNewCommentTextsMap(prev => ({ ...prev, [postId]: '' }));
                fetchComments(postId);
                setPosts(prevPosts => prevPosts.map(post => 
                    post.id === postId ? { ...post, commentCount: (post.commentCount || 0) + 1 } : post
                ));
            }
        } catch (err) {
            console.error("Error saving comment:", err);
        }
    };

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        if (!newRoomName.trim()) return;

        setModalLoading(true);
        setModalError('');

        try {
            const response = await api.post('/room', {
                name: newRoomName.trim(), 
                description: newRoomDescription.trim()
            });

            if (response.status === 201 || response.status === 200) {
                setNewRoomName('');
                setNewRoomDescription('');
                setIsModalOpen(false); 
                fetchPosts(); 
            }
        } catch (err) {
            console.error("Room creation error:", err);
            setModalError(err.response?.data?.message || "Failed to create community.");
        } finally {
            setModalLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="home-wrapper" style={{ justifyContent: 'center' }}>
                <style>{`
                    .home-wrapper { min-height: 100vh; width: 100%; background: #020617; font-family: 'Inter', sans-serif; color: white; display: flex; padding: 24px 20px; box-sizing: border-box; }
                    .spinner { width: 32px; height: 32px; border: 3px solid rgba(59,130,246,0.2); border-top-color: #3b82f6; border-radius: 50%; animation: spin 0.8s linear infinite; align-self: center; }
                    @keyframes spin { to { transform: rotate(360deg); } }
                `}</style>
                <div className="spinner" />
            </div>
        );
    }

    return (
        <div className="home-wrapper">
            <style>{`
                .home-wrapper { min-height: 100vh; width: 100%; background: #020617; font-family: 'Inter', sans-serif; color: white; display: flex; flex-direction: column; align-items: center; padding: 30px 20px; box-sizing: border-box; position: relative; }
                .home-glow { position: absolute; width: 600px; height: 600px; background: rgba(59, 130, 246, 0.03); border-radius: 50%; filter: blur(140px); pointer-events: none; top: 10%; left: 50%; transform: translateX(-50%); z-index: 0; }
                .feed-container { width: 100%; max-width: 680px; z-index: 10; display: flex; flex-direction: column; gap: 20px; }
                
                .discussion-shell { background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid #1e293b; padding: 16px 20px; border-radius: 20px; display: flex; align-items: center; gap: 14px; box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5); }
                .shell-avatar { width: 36px; height: 36px; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 10px; flex-shrink: 0; }
                .shell-input { flex: 1; background: #020617; border: 1px solid #1e293b; padding: 12px 16px; border-radius: 12px; color: white; font-size: 13px; outline: none; transition: all 0.3s; }
                .shell-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
                .shell-btn { background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); color: #3b82f6; padding: 11px 16px; border-radius: 12px; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.03em; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.2s; white-space: nowrap; }
                .shell-btn:hover { background: #3b82f6; color: white; }

                .post-card { background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid #1e293b; border-radius: 24px; display: flex; overflow: hidden; box-shadow: 0 20px 40px -15px rgba(0,0,0,0.6); transition: border-color 0.3s; }
                .post-card:hover { border-color: rgba(59, 130, 246, 0.4); }
                
                .vote-panel { width: 48px; background: rgba(2, 6, 23, 0.4); border-right: 1px solid #1e293b; display: flex; flex-direction: column; align-items: center; padding: 20px 0; gap: 6px; flex-shrink: 0; }
                .vote-btn { background: none; border: none; color: #475569; cursor: pointer; padding: 4px; border-radius: 6px; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
                .vote-btn:hover.up { color: #f97316; background: rgba(249, 115, 22, 0.1); }
                .vote-btn:hover.down { color: #3b82f6; background: rgba(59, 130, 246, 0.1); }
                .vote-count { font-size: 13px; font-weight: 800; color: #f8fafc; min-width: 20px; text-align: center; }

                .post-main { padding: 22px 24px; flex: 1; min-width: 0; text-align: left; }
                .post-meta { display: flex; align-items: center; gap: 8px; font-size: 11px; color: #64748b; margin-bottom: 10px; }
                .post-room { color: #3b82f6; background: rgba(59, 130, 246, 0.1); font-weight: 800; padding: 3px 8px; border-radius: 6px; font-size: 11px; }
                .post-title { font-size: 17px; font-weight: 700; color: #f1f5f9; margin: 0 0 10px 0; line-height: 1.4; }
                .post-desc { font-size: 13px; color: #94a3b8; margin: 0 0 18px 0; line-height: 1.6; white-space: pre-line; }
                
                .post-actions { display: flex; align-items: center; gap: 16px; border-top: 1px solid rgba(30, 41, 59, 0.5); padding-top: 14px; }
                .action-trigger { display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer; padding: 6px 10px; border-radius: 8px; transition: 0.2s; user-select: none; }
                .action-trigger:hover { color: #f1f5f9; background: rgba(255,255,255,0.04); }
                .action-trigger.active { color: #3b82f6; background: rgba(59, 130, 246, 0.1); }

                .comments-drawer { background: rgba(2, 6, 23, 0.5); border-top: 1px solid #1e293b; padding: 20px 24px; display: flex; flex-direction: column; gap: 16px; }
                .comment-form { display: flex; gap: 10px; }
                .comment-field { flex: 1; background: #020617; border: 1px solid #1e293b; padding: 10px 14px; border-radius: 10px; color: white; font-size: 13px; outline: none; }
                .comment-field:focus { border-color: #3b82f6; }
                .comment-submit { background: #1e293b; border: 1px solid #334155; color: #94a3b8; padding: 0 14px; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
                .comment-submit:hover { background: #3b82f6; color: white; border-color: #3b82f6; }
                .comments-list { display: flex; flex-direction: column; gap: 10px; max-height: 260px; overflow-y: auto; padding-right: 4px; }
                .comment-item { background: rgba(15, 23, 42, 0.6); border: 1px solid #1e293b; padding: 12px 16px; border-radius: 12px; text-align: left; }
                .comment-user { font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.03em; }
                .comment-text { font-size: 12px; color: #cbd5e1; margin: 0; line-height: 1.5; }

                .modal-overlay { position: fixed; inset: 0; background: rgba(2, 6, 23, 0.8); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; }
                .modal-card { background: rgba(15, 23, 42, 0.95); border: 1px solid #1e293b; width: 100%; max-width: 420px; padding: 36px; border-radius: 24px; box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.8); position: relative; }
                .modal-close { position: absolute; top: 20px; right: 20px; background: none; border: none; color: #475569; cursor: pointer; padding: 6px; border-radius: 50%; transition: 0.2s; display: flex; }
                .modal-close:hover { color: white; background: rgba(255,255,255,0.05); }
                .modal-title { font-size: 20px; font-weight: 800; margin: 0 0 6px 0; text-align: left; letter-spacing: -0.01em; }
                .modal-subtitle { font-size: 13px; color: #64748b; margin: 0 0 24px 0; text-align: left; }
                .modal-group { margin-bottom: 20px; text-align: left; }
                .modal-group label { display: block; font-size: 11px; font-weight: 800; color: #64748b; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em; }
                .modal-input { width: 100%; background: #020617; border: 1px solid #1e293b; padding: 12px 14px; border-radius: 12px; color: white; font-size: 14px; outline: none; transition: 0.2s; box-sizing: border-box; }
                .modal-input:focus { border-color: #3b82f6; background: #0f172a; }
                .modal-textarea { width: 100%; background: #020617; border: 1px solid #1e293b; padding: 12px 14px; border-radius: 12px; color: white; font-size: 14px; outline: none; transition: 0.2s; resize: none; box-sizing: border-box; font-family: inherit; }
                .modal-textarea:focus { border-color: #3b82f6; background: #0f172a; }
                .modal-submit { width: 100%; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 14px; border-radius: 12px; border: none; font-weight: 700; font-size: 14px; cursor: pointer; transition: 0.2s; box-shadow: 0 10px 20px -5px rgba(37, 99, 235, 0.3); }
                .modal-submit:hover { transform: translateY(-1px); box-shadow: 0 12px 22px -5px rgba(37, 99, 235, 0.4); }
                .modal-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
                .modal-error { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); color: #ef4444; padding: 10px 14px; border-radius: 10px; font-size: 12px; margin-bottom: 18px; display: flex; align-items: center; gap: 8px; text-align: left; }
                
                .icon-centered { display: inline-flex; align-items: center; justify-content: center; }
            `}</style>

            <div className="home-glow" />

            <div className="feed-container">
                {posts.map((post) => (
                    <div key={post.id} className="post-card" style={{ flexDirection: 'column' }}>
                        <div style={{ display: 'flex', width: '100%' }}>
                            
                            {/* Vote Slot Panel */}
                            <div className="vote-panel">
                                <button onClick={() => handleVote(post.id, 'UPVOTE')} className="vote-btn up">
                                    <ArrowBigUp size={20} />
                                </button>
                                <span className="vote-count">{post.voteCount || 0}</span>
                                <button onClick={() => handleVote(post.id, 'DOWNVOTE')} className="vote-btn down">
                                    <ArrowBigDown size={20} />
                                </button>
                            </div>

                            {/* Core Post Details Slot */}
                            <div className="post-main">
                                <div className="post-meta">
                                    <span className="post-room">r/{post.roomName}</span>
                                    <span>•</span>
                                    <span>Posted by u/{post.userName || 'anonymous'}</span>
                                </div>
                                <h2 className="post-title">{post.postName}</h2>
                                <p className="post-desc">{post.description}</p>

                                {/* Bottom Structural Action Triggers */}
                                <div className="post-actions">
                                    <div 
                                        onClick={() => handleToggleComments(post.id)} 
                                        className={`action-trigger ${activePostCommentId === post.id ? 'active' : ''}`}
                                    >
                                        <MessageSquare size={14} className="icon-centered" />
                                        <span>{post.commentCount || 0} Comments</span>
                                    </div>
                                    <div className="action-trigger">
                                        <Share2 size={14} className="icon-centered" />
                                        <span>Share</span>
                                    </div>
                                    <div className="action-trigger" style={{ padding: '6px' }}>
                                        <MoreHorizontal size={14} className="icon-centered" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Dropdown Active Comments Drawer Row Section */}
                        {activePostCommentId === post.id && (
                            <div className="comments-drawer">
                                <form onSubmit={(e) => handleCommentSubmit(e, post.id)} className="comment-form">
                                    <input 
                                        type="text" 
                                        required 
                                        value={newCommentTextsMap[post.id] || ''}
                                        onChange={(e) => handleCommentTextChange(post.id, e.target.value)}
                                        placeholder="Add to the processing discussion stream..."
                                        className="comment-field"
                                    />
                                    <button type="submit" className="comment-submit">
                                        <Send size={13} />
                                    </button>
                                </form>

                                <div className="comments-list">
                                    {commentsLoading ? (
                                        <div style={{ color: '#64748b', fontSize: '12px', textAlign: 'center', padding: '10px 0' }}>Syncing comments...</div>
                                    ) : commentsMap[post.id]?.length > 0 ? (
                                        commentsMap[post.id].map((comment) => (
                                            <div key={comment.id} className="comment-item">
                                                <div className="comment-user">u/{comment.userName || 'user'}</div>
                                                <p className="comment-text">{comment.text}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ color: '#64748b', fontSize: '12px', textAlign: 'center', padding: '15px 0', fontStyle: 'italic' }}>No comments posted yet.</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* --- DETACHED DOM OVERLAY MODAL FOR COMMUNITY BUILDER --- */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <button onClick={() => setIsModalOpen(false)} className="modal-close">
                            <X size={16} />
                        </button>

                        <h3 className="modal-title">Create a Room</h3>
                        <p className="modal-subtitle">Establish an explicit community category domain.</p>

                        {modalError && (
                            <div className="modal-error">
                                <AlertCircle size={15} />
                                <span>{modalError}</span>
                            </div>
                        )}

                        <form onSubmit={handleCreateRoom}>
                            <div className="modal-group">
                                <label>Room Name</label>
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ position: 'absolute', left: '14px', color: '#475569', fontSize: '14px', fontWeight: '800' }}>r/</span>
                                    <input 
                                        type="text" 
                                        required 
                                        placeholder="JavaSpring" 
                                        value={newRoomName}
                                        onChange={(e) => setNewRoomName(e.target.value)}
                                        className="modal-input"
                                        style={{ paddingLeft: '28px' }}
                                    />
                                </div>
                            </div>

                            <div className="modal-group">
                                <label>Description</label>
                                <textarea 
                                    rows="3" 
                                    placeholder="Describe what concepts live inside this sub-abode..." 
                                    value={newRoomDescription}
                                    onChange={(e) => setNewRoomDescription(e.target.value)}
                                    className="modal-textarea"
                                />
                            </div>

                            <button type="submit" disabled={modalLoading} className="modal-submit">
                                {modalLoading ? 'Creating...' : 'Establish Community'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;