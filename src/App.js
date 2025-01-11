import React, { useState } from 'react';
import axios from 'axios';
import { BsChevronUp, BsArrowBarDown } from 'react-icons/bs';
import ReactGA from 'react-ga4';
import './App.css';

ReactGA.initialize('G-6ZBCKLMD0R');
ReactGA.send('pageview');

function App() {
	const [prompt, setPrompt] = useState('');
	const [submited, setSubmited] = useState(false);
	const [image, setImage] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const generate = async () => {
		setLoading(true);
		setError('');

		ReactGA.event({category: 'User Interaction', action: 'Clicked Generate Image Button'});

		if (prompt.length < 1) {
			setError('Invalid input data, Try Again.');
			setPrompt('');
			setLoading(false);
			setTimeout(() => setError(''), 10000);
			return;
		};

		setSubmited(true);

		try {
			const response = await axios.post(
				'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell',
				{
					inputs: prompt,
				},
				{
					headers: {
						Authorization: 'Bearer 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',
						'Cache-Control': 'no-cache',
					},
					responseType: 'blob',
				},
			);

			const imageUrl = URL.createObjectURL(response.data);
			setImage(imageUrl);
		} catch (error) {
			if (error.response) {
				if (error.response.status === 400) {
					setError('Invalid input data, Try Again.');
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

		setTimeout(() => setError(''), 10000);
		setLoading(false);
	};

	return (
		<div className="app">
			<div className={`error ${error && 'shown'}`}>
	            {
	            	error &&
	            	<div className="error-container">
		            	{error}
		            </div>
	            }
	       	</div>

			<div className={`hero ${submited && 'slide-up'}`}>
	           	<h1 className="app-title">Artify-AI</h1>
	           	{
	              	!submited &&
	              	<p className="app-description">
		            	Transform your Imagination into Visuals with <b>Artify-AI</b>,
		       			the Cutting-edge AI-powered App!
		         	</p>
	           	}
	      	</div>

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
	               		<button onClick={generate} className={`generate-btn ${'loading'}`} disabled>
		                  	<BsChevronUp />
		              	</button> :
		              	<button onClick={generate} className="generate-btn">
		                 	<BsChevronUp />
		              	</button>
	               	}
            	</div>
         	</div>

			<div className={`image-card ${submited && 'shown'}`}>
				{
					image &&
					<div className="image-container">
						<img className="generated-image" src={image} alt={prompt} />
						<span className="generated-image-overlay"></span>
					</div>
				}
				{ !image && <div className="generated-image-loader"></div> }
				{
					image &&
					<a className="download-button" href={image} download={`${prompt}.jpg`}>
						<h6>Download</h6>
						<BsArrowBarDown />
					</a>
				}
			</div>
		</div>
	);
};

export default App;
