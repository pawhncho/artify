import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactGA from 'react-ga4';
import './App.css';
import logo from './logo.png';

ReactGA.initialize('G-6ZBCKLMD0R');
ReactGA.send('pageview');

function App() {
	const pageSize = useRef(window.innerWidth);
	const [prompt, setPrompt] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState();
	const [images, setImages] = useState([
		{
			'image': 'https://cdn.pixabay.com/photo/2023/03/28/13/28/ai-generated-7883147_128.jpg',
			'prompt': 'A kitten',
		},
	]);

	useEffect(() => {
		window.addEventListener('resize', () => {
			pageSize.current = window.innerWidth;
		});
	}, [pageSize]);

	const generate = async () => {
		setLoading(true);
		setError('');

		if (prompt.length <= 2) {
			setError('Text must be more than 2 letters.');
			setLoading(false);
			return;
		};

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
			setImages(images => [...images, { 'image': imageUrl, 'prompt': prompt }]);
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
		setPrompt('');
		setLoading(false);
	};

	if (pageSize.current >= 600) {
		return (
			<div className="app">
				<main>
					<div className="not-supportive">
						<div className="icon">📱</div>
						<h1 className="message">Screen Size Not Supported</h1>
						<p className="detail">
							This app works on devices with smaller screens.
							Please switch to a mobile or tablet device for better experience.
						</p>
					</div>
				</main>
			</div>
		);
	};

	return (
		<div className="app">
			<header className="hero">
                <h1 className="app-title">Artify-AI</h1>
                <p className="app-description">
                    Transform your Imagination into Visuals with <b>Artify-AI</b>,
                    the Cutting-edge AI-powered App!
                </p>
            </header>

            <main>
            	<section className="input-section">
            		<div className="input-error">
            			{error}
            		</div>
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
                    	<button onClick={generate} className="generate-btn" aria-label="Text to Image" disabled>
	                        <div className="generate-btn-loader"></div>
	                    </button> :
	                    <button onClick={generate} className="generate-btn" aria-label="Text to Image">
	                        Generate Image
	                    </button>
                    }
                </section>

                <section className="gallery">
                	<h2 className="visually-hidden">Generated Images</h2>
                	{
                		images.slice().reverse().map(image => {
                			return <Article image={image} />
                		})
                	}
                </section>
            </main>

            <footer className="footer">
            	<p>
            		© 2024 Artify-AI. All Rights Reserved. Built by Pawhncho
            	</p>
            </footer>
		</div>
	);
};

function Article({ image }) {
	const [loading, setLoading] = useState(true);

	return (
		<article className="image-card" aria-label="Generated Image">
			<img
				src={image.image}
				alt={image.prompt}
				className={`generated-image ${loading && 'loading'}`}
				onLoad={e => setLoading(false)}
			/>
			{
				loading &&
				<div className="generated-image">
					<div className="image-loader"></div>
				</div>
			}
			<p>{image.prompt}</p>
		</article>
	);
};

export default App;
