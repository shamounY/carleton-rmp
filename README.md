# Carleton RMP Chrome Extension

<p align="center">
  <img src="assets/icons/icon128.png" alt="Carleton RMP Logo" width="128" height="128">
</p>

A Chrome extension that integrates Rate My Professors data directly into Carleton Centrals course registration page. This extension provides quick access to professor ratings and reviews while browsing courses.

## Features

- Displays professor ratings and reviews from Rate My Professors
- Caches professor data for improved performance
- Seamless integration with Carleton's course registration system
- Automatic professor name matching
- Data caching with 30-day expiration

## Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/carleton-rmp.git
```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" in the top right corner

4. Click "Load unpacked" and select the `carleton-rmp` directory

## Development

This project is built using:
- TypeScript
- Chrome Extension APIs
- Rate My Professors API (via @mtucourses/rate-my-professors)

### Project Structure

```
carleton-rmp/
├── src/
│   ├── background/     # Background scripts
│   └── content/        # Content scripts
├── manifest.json       # Extension configuration
└── README.md
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Rate My Professors](https://www.ratemyprofessors.com/) for providing the data
- [@mtucourses/rate-my-professors](https://github.com/mtucourses/rate-my-professors) for the API wrapper 