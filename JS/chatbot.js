const GEMINI_API_KEY = 'AIzaSyCHGrS8cPzgAEHPjUb6GOKPZPhxJEho8xw';
 const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`; 
 
 
  let lastRequestTime = 0;
const REQUEST_DELAY = 3000; // 3 seconds between requests


 // GET EVENTS CONTEXT
 function getEventsContext() {
    const allEvents = getEvents();
    const announcements = JSON.parse(
        localStorage.getItem('announcements') || '[]'
    );

    let context = `You are a helpful college event assistant for ITS CPS College. 
    Be friendly and concise. Answer in maximum 3-4 sentences.
    
    Events:\n`;

    allEvents.forEach(event => {
        context += `- ${event.title} | ${event.category} | Date: ${event.date} | Venue: ${event.venue} | Seats: ${event.totalSeats - event.filledSeats} available | Deadline: ${event.registrationDeadline}\n`;
    });

    context += `\nAnnouncements:\n`;
    announcements.slice(0, 2).forEach(ann => {
        context += `- ${ann.title}: ${ann.content.substring(0, 100)}\n`;
    });

    context += `\nTo register: Go to home page → View Details → Register Now.`;

    return context;
}

// SEND MESSAGE TO GEMINI

 async function sendToGemini(userMessage, retryCount = 0) {

    
    const context = getEventsContext();

    try {
        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: `${context}\n\nStudent Question: ${userMessage}\n\nPlease give a short and helpful answer in 2-3 sentences only.`
                            }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 500
                }
            })
        });

        // IF TOO MANY REQUESTS AND RETRY COUNT IS LESS THAN 3
        if (response.status === 429 && retryCount < 3) {
            console.log(`Retry attempt ${retryCount + 1}...`);
            // WAIT 10 SECONDS THEN RETRY
            await new Promise(resolve => setTimeout(resolve, 10000));
            return sendToGemini(userMessage, retryCount + 1);
        }

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Gemini API Error:', errorData);
            throw new Error('API Error');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// CREATE CHATBOT UI
function createChatbot() {
    const chatHTML = `
        <!-- CHAT BUTTON -->
        <button id="chatBtn" onclick="toggleChat()"
            style="position:fixed; bottom:30px; right:30px;
                   width:60px; height:60px; border-radius:50%;
                   background:linear-gradient(135deg, #4F46E5, #7C3AED);
                   border:none; cursor:pointer; z-index:9999;
                   box-shadow:0 8px 25px rgba(79,70,229,0.4);
                   font-size:26px; transition:all 0.3s ease;
                   display:flex; align-items:center; justify-content:center;">
            🤖
        </button>

        <!-- CHAT WINDOW -->
        <div id="chatWindow"
            style="position:fixed; bottom:100px; right:30px;
                   width:350px; height:480px; background:var(--card-bg);
                   border-radius:20px; box-shadow:0 20px 60px rgba(0,0,0,0.2);
                   display:none; flex-direction:column; z-index:9998;
                   border:1px solid rgba(79,70,229,0.1); overflow:hidden;">

            <!-- CHAT HEADER -->
            <div style="background:linear-gradient(135deg, #4F46E5, #7C3AED);
                        padding:18px 20px; display:flex;
                        align-items:center; gap:12px;">
                <div style="width:40px; height:40px; background:rgba(255,255,255,0.2);
                            border-radius:50%; display:flex; align-items:center;
                            justify-content:center; font-size:20px;">
                    🤖
                </div>
                <div>
                    <p style="color:white; font-weight:700; 
                              font-size:15px; margin:0;">
                        CPS Assistant
                    </p>
                    <p style="color:rgba(255,255,255,0.7); 
                              font-size:12px; margin:0;">
                        Powered by Gemini AI ✨
                    </p>
                </div>
                <button onclick="toggleChat()"
                    style="margin-left:auto; background:rgba(255,255,255,0.2);
                           border:none; color:white; width:30px; height:30px;
                           border-radius:50%; cursor:pointer; font-size:16px;">
                    ✕
                </button>
            </div>

            <!-- CHAT MESSAGES -->
            <div id="chatMessages"
                style="flex:1; overflow-y:auto; padding:16px;
                       display:flex; flex-direction:column; gap:12px;">

                <!-- WELCOME MESSAGE -->
                <div style="background:linear-gradient(135deg, #EEF2FF, #C7D2FE);
                            padding:12px 16px; border-radius:12px 12px 12px 0;
                            max-width:85%;">
                    <p style="font-size:13px; color:#4338CA; margin:0; line-height:1.6;">
                        Hi! 👋 I am your CPS Events Assistant powered by Gemini AI!
                        Ask me anything about events, registrations, or announcements!
                    </p>
                </div>

            </div>

            <!-- QUICK QUESTIONS -->
            <div style="padding:8px 16px; display:flex; gap:6px; flex-wrap:wrap;">
                <button onclick="askQuick('What events are available?')"
                    style="background:#EEF2FF; color:#4338CA; border:none;
                           padding:5px 10px; border-radius:20px; font-size:11px;
                           cursor:pointer; font-weight:600;">
                    📅 All Events
                </button>
                <button onclick="askQuick('Which events have seats available?')"
                    style="background:#F0FDF4; color:#15803D; border:none;
                           padding:5px 10px; border-radius:20px; font-size:11px;
                           cursor:pointer; font-weight:600;">
                    🪑 Seats
                </button>
                <button onclick="askQuick('How do I register for an event?')"
                    style="background:#FFF1F2; color:#BE123C; border:none;
                           padding:5px 10px; border-radius:20px; font-size:11px;
                           cursor:pointer; font-weight:600;">
                    📝 How to Register
                </button>
            </div>

            <!-- CHAT INPUT -->
            <div style="padding:12px 16px; border-top:1px solid rgba(79,70,229,0.08);
                        display:flex; gap:8px;">
                <input type="text" id="chatInput"
                    placeholder="Ask me anything..."
                    style="flex:1; padding:10px 14px; border:2px solid rgba(79,70,229,0.1);
                           border-radius:10px; font-size:13px; outline:none;
                           font-family:'Plus Jakarta Sans',sans-serif;
                           background:var(--bg); color:var(--text);">
                <button onclick="sendMessage()"
                    style="background:linear-gradient(135deg, #4F46E5, #7C3AED);
                           border:none; color:white; width:40px; height:40px;
                           border-radius:10px; cursor:pointer; font-size:18px;">
                    ➤
                </button>
            </div>

        </div>`;

    document.body.insertAdjacentHTML('beforeend', chatHTML);

    // SEND ON ENTER KEY
    document.getElementById('chatInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

// TOGGLE CHAT WINDOW
function toggleChat() {
    const window_ = document.getElementById('chatWindow');
    const btn = document.getElementById('chatBtn');
    if (window_.style.display === 'none' || window_.style.display === '') {
        window_.style.display = 'flex';
        btn.textContent = '✕';
        btn.style.background = 'linear-gradient(135deg, #F43F5E, #BE123C)';
    } else {
        window_.style.display = 'none';
        btn.textContent = '🤖';
        btn.style.background = 'linear-gradient(135deg, #4F46E5, #7C3AED)';
    }
}

// SEND MESSAGE
 async function sendMessage() {
    const now = Date.now();
    if (now - lastRequestTime < REQUEST_DELAY) {
        addMessage('Please wait a moment before sending another message! 😊', 'bot');
        return;
    }
    lastRequestTime = now;

    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message) return;

    // DISABLE BUTTON WHILE PROCESSING
    const sendBtn = document.querySelector('#chatWindow button:last-child');
    sendBtn.disabled = true;
    sendBtn.style.opacity = '0.5';

    addMessage(message, 'user');
    input.value = '';
    addTyping();

    try {
        const response = await sendToGemini(message);
        removeTyping();
        addMessage(response, 'bot');
    } catch (error) {
        removeTyping();
        addMessage('Sorry! Too many requests. Please wait 30 seconds and try again! 😔', 'bot');
    } finally {
        // RE-ENABLE BUTTON
        sendBtn.disabled = false;
        sendBtn.style.opacity = '1';
    }
}

// QUICK QUESTION
function askQuick(question) {
    document.getElementById('chatInput').value = question;
    sendMessage();
}

// ADD MESSAGE TO CHAT
function addMessage(text, sender) {
    const messages = document.getElementById('chatMessages');
    const isUser = sender === 'user';

    const div = document.createElement('div');
    div.style.cssText = `
        padding: 12px 16px;
        border-radius: ${isUser ? '12px 12px 0 12px' : '12px 12px 12px 0'};
        max-width: 85%;
        align-self: ${isUser ? 'flex-end' : 'flex-start'};
        background: ${isUser
            ? 'linear-gradient(135deg, #4F46E5, #7C3AED)'
            : 'var(--bg)'};
        color: ${isUser ? 'white' : 'var(--text)'};
        font-size: 13px;
        line-height: 1.6;
    `;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

// TYPING INDICATOR
 function addTyping() {
    const messages = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.id = 'typingIndicator';
    div.style.cssText = `
        padding: 12px 16px;
        border-radius: 12px 12px 12px 0;
        max-width: 85%;
        background: var(--bg);
        font-size: 13px;
    `;
    div.textContent = '⏳ Please wait...';
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function removeTyping() {
    const typing = document.getElementById('typingIndicator');
    if (typing) typing.remove();
}

// INITIALIZE CHATBOT
document.addEventListener('DOMContentLoaded', createChatbot);