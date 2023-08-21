<link rel="stylesheet" type="text/css" href="./build/css/readme.css">

<div class="product-container">
  <div>
    <p>
      <a aria-label="Arrow logo">
        <img width ="45px" height="35px" src="./build/icons/512x512.png">
      </a>
    </p>
  </div>
  <div class="product-label" >
    <p>TalkGPT</p>
  </div>
</div>

#### Desktop App that connects to GPT_3.5_Turbo through Chat Completion API.

## Run

#### Dependecy Installation

    yarn

#### create a .env file at the root of the project & enter the following

    OPENAI_API_KEY=your_api_key

replace `your_api_key` with actual secret API key from OpenAI

#### Generate platform specific executables

    yarn package

### Works standalone as well as with [Able](https://github.com/umangrajpara13/Able) for Speech-to-Text Capability
