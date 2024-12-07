import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import logo from './logo.png';

function App() {
	const [prompt, setPrompt] = useState();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState();
	const [images, setImages] = useState([
		{
			'image': 'https://cdn.pixabay.com/photo/2023/03/28/13/28/ai-generated-7883147_1280.jpg',
			'prompt': 'A kitten',
		},
		{
			'image': 'https://images.nightcafe.studio/jobs/czaaLxwVb4dbpTkktTdE/czaaLxwVb4dbpTkktTdE--3--4lgpv.jpg',
			'prompt': 'White dog flying in the sky'
		},
	]);

	const generateStory = async () => {
		const apiUrl = 'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell';
		const apiToken = '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';
		setLoading(true);
		setError();

		try {
			const response = await axios.post(
				apiUrl,
				{
					inputs: prompt,
				},
				{
					headers: {
						Authorization: `Bearer ${apiToken}`,
						"Cache-Control": "no-cache",
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

	return (
		<div className="app">
			<header className="hero">
                <h1 className="app-title">Artify-AI</h1>
                <p className="app-description">
                    Turn your ideas into stunning visuals with our AI-powered app.
                </p>
            </header>

            <main>
            	<section className="input-section">
            		<div className="input-error">
            			{error}
            		</div>
                    <input
                        id="prompt"
                        type="text"
                        placeholder="What are you thinking of..."
                        className="prompt-input"
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                    />
                    <button onClick={generateStory} className="generate-btn" aria-label="Generate image from text">
                        Generate Image
                    </button>
                </section>

                <section className="gallery">
                	<h2 className="visually-hidden">Generated Images</h2>
                	{
                		images.slice().reverse().map(image => {
                			return (
                				<>
                					<article className="image-card" aria-label="Generated Image 1">
				                        <img
				                            src={image.image}
				                            alt="Generated visual based on prompt"
				                            className="generated-image"
				                        />
				                        <p>{image.prompt}</p>
				                    </article>
                				</>
                			)
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

export default App;
