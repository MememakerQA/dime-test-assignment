# dime-test-assignment

## Project Overview
This project is designed to automate and test the functionality of a stock-buying system for the Thai market. It leverages Playwright for end-to-end testing and includes configurations, models, and test data to ensure comprehensive coverage.

## Folder Structure
- **config/**: Contains configuration files, such as database settings.
- **models/**: Includes data models used in the application.
- **requests/**: Handles API requests related to the stock-buying system.
- **test-datas/**: Stores test data, including error responses and other mock data.
- **tests/**: Contains Playwright test specifications.

## Prerequisites
- Node.js (v16 or later)
- Yarn

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd dime-test-assignment
   ```
3. Install dependencies:
   ```bash
   yarn install
   ```

## Running Tests
To execute the Playwright tests, run:
```bash
yarn playwright test
```

## Configuration
Update the configuration files in the `config/` directory as needed to match your environment.

## License
This project is licensed under the MIT License.
