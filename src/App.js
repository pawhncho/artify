import React, { useState } from 'react';
import axios from 'axios';
import { BsArrowUpShort } from 'react-icons/bs';
import ReactGA from 'react-ga4';
import './App.css';

ReactGA.initialize('G-6ZBCKLMD0R');
ReactGA.send('pageview');

function App() {
	const [prompt, setPrompt] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState();
	const [chat, setChat] = useState([]);

	const generate = async () => {
		setLoading(true);
		setError('');

		if (prompt.length <= 2) {
			setError('Input is required');
			setLoading(false);
			setTimeout(() => setError(''), 3000);
			return;
		};

		setChat(prev => [...prev, { role: 'user', content: prompt }]);
		setPrompt('');

		ReactGA.event({
			category: 'User Interaction',
			action: 'Clicked Generate Image Button',
		});

		const apiUrl = 'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell';
		const apiToken = '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';

		try {
			const response = await axios.post(
				apiUrl,
				{
					inputs: prompt,
				},
				{
					headers: {
						Authorization: `Bearer ${apiToken}`,
						'Cache-Control': 'no-cache',
					},
					responseType: 'blob',
				},
			);

			const imageUrl = URL.createObjectURL(response.data);
			setChat(prev => [...prev, { role: 'bot', content: imageUrl }]);
		} catch (error) {
			if (error.response) {
				if (error.response.status === 400) {
					setError('Invalid input data.');
				} else if (error.response.status === 401) {
					setError('Invalid authorization token.');
				} else if (error.response.status === 403) {
					setError('You have reached your quota limit.');
				} else if (error.response.status === 404) {
					setError('Model does not exist.');
				} else if (error.response.status === 429) {
					setError('Too many requests. Please slow down.');
				} else if (error.response.status === 500) {
					setError('Unexpected server error occurred.');
				} else if (error.response.status === 503) {
					setError('Model is currently loading, Try later.');
				} else {
					setError('Unknown error occured, Try again.');
				};
			} else {
				setError('Unknown error occured, Try again.');
			};
		};

		setTimeout(() => setError(''), 3000);
		setLoading(false);
	};

	return (
		<div className="app">
			<div className="not-supportive">
				<div className="icon">🖥️</div>
				<h1 className="message">Not Supported on Desktop</h1>
				<p className="detail">
					Artify-AI is optimized for mobile devices to provide the best experience
					for our users. Please switch to your phone or tablet to enjoy creating
					amazing AI-generated art.
				</p>
			</div>

			<div className="error">
            	<div className="error-container">
            		{error}
            	</div>
            </div>

			{
				chat.length < 1 &&
				<div className="hero">
	                <h1 className="app-title">Artify-AI</h1>
	                <p className="app-description">
	                    Transform your Imagination into Visuals with <b>Artify-AI</b>,
	                    the Cutting-edge AI-powered App!
	                </p>
	            </div>
			}

           	<div className="input-section">
            	<div className="input-form">
                   	{
	                   	loading ?
	                   	<input
		                 	type="text"
		                 	placeholder="What are you thinking of..."
		                 	className="prompt-input"
		                 	value={prompt}
		                 	onChange={e => setPrompt(e.target.value)}
		                 	disabled
		              	/> :
		              	<input
		                 	type="text"
		                 	placeholder="What are you thinking of..."
		                 	className="prompt-input"
		                 	value={prompt}
		                 	onChange={e => setPrompt(e.target.value)}
		             	/>
	               	}
	               	{
	                   	loading ?
	               		<button onClick={generate} className="generate-btn" disabled>
		                  	<div className="generate-btn-loader"></div>
		              	</button> :
		              	<button onClick={generate} className="generate-btn">
		                 	<BsArrowUpShort />
		              	</button>
	               	}
            	</div>
         	</div>

        	<div className="gallery">
               	{ chat.map((message, index) => <Article message={message} index={index} />) }
           	</div>
		</div>
	);
};

function Article({ message, index }) {
	return (
		<div id={index} className={`message-card ${message.role === 'user' ? 'user-card' : 'bot-card'}`}>
			{
				message.role !== 'user' &&
				<img
					src={message.content}
					alt={message.content}
					className="generated-image"
				/>
			}
			{ message.role !== 'user' && <div className="image-overlay"></div> }
			{ message.role === 'user' && <p>{message.content}</p> }
		</div>
	);
};

export default App;
