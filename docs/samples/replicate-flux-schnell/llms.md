## Basic model info

Model name: black-forest-labs/flux-schnell
Model description: The fastest image generation model tailored for local development and personal use


## Model inputs

- prompt (required): Prompt for generated image (string)
- aspect_ratio (optional): Aspect ratio for the generated image (string)
- num_outputs (optional): Number of outputs to generate (integer)
- num_inference_steps (optional): Number of denoising steps. 4 is recommended, and lower number of steps produce lower quality outputs, faster. (integer)
- seed (optional): Random seed. Set for reproducible generation (integer)
- output_format (optional): Format of the output images (string)
- output_quality (optional): Quality when saving the output images, from 0 to 100. 100 is best quality, 0 is lowest quality. Not relevant for .png outputs (integer)
- disable_safety_checker (optional): Disable safety checker for generated images. (boolean)
- go_fast (optional): Run faster predictions with model optimized for speed (currently fp8 quantized); disable to run in original bf16. Note that outputs will not be deterministic when this is enabled, even if you set a seed. (boolean)
- megapixels (optional): Approximate number of megapixels for generated image (string)


## Model output schema

{
  "type": "array",
  "items": {
    "type": "string",
    "format": "uri"
  },
  "title": "Output"
}

If the input or output schema includes a format of URI, it is referring to a file.


## Example inputs and outputs

Use these example outputs to better understand the types of inputs the model accepts, and the types of outputs the model returns:

### Example (https://replicate.com/p/jd96x0dyqsrm00cj1jp90zeye0)

#### Input

```json
{
  "prompt": "black forest gateau cake spelling out the words \"FLUX SCHNELL\", tasty, food photography, dynamic shot",
  "go_fast": true,
  "num_outputs": 1,
  "aspect_ratio": "1:1",
  "output_format": "webp",
  "output_quality": 80
}
```

#### Output

```json
[
  "https://replicate.delivery/yhqm/hcDDSNf633zeDUz9sWkKfaftcfJLWIvuhn9vfCFWmufxelmemA/out-0.webp"
]
```


### Example (https://replicate.com/p/a7nfg37nvnrm00cj1jtth49krw)

#### Input

```json
{
  "prompt": "a tiny astronaut hatching from an egg on the moon",
  "go_fast": true,
  "num_outputs": 1,
  "aspect_ratio": "1:1",
  "output_format": "webp",
  "output_quality": 80
}
```

#### Output

```json
[
  "https://replicate.delivery/yhqm/QeGlhr8w4CWefov8rFAozycqveU4anxkYuUVxANfolFP710bC/out-0.webp"
]
```


### Example (https://replicate.com/p/awgeayn1nhrm20cj1jvtqknaaw)

#### Input

```json
{
  "prompt": "womens street skateboarding final in Paris Olympics 2024",
  "go_fast": true,
  "num_outputs": 1,
  "aspect_ratio": "1:1",
  "output_format": "webp",
  "output_quality": 80
}
```

#### Output

```json
[
  "https://replicate.delivery/yhqm/pNZ3A6l9B35dB9VxE0eGqkGfBGe401MjUttdOyzvpfWbEb6NB/out-0.webp"
]
```


### Example (https://replicate.com/p/t344ym22yxrm00cj1jwb952wsc)

#### Input

```json
{
  "prompt": "a cat holding a sign that says hello world",
  "go_fast": true,
  "num_outputs": 1,
  "aspect_ratio": "1:1",
  "output_format": "webp",
  "output_quality": 80
}
```

#### Output

```json
[
  "https://replicate.delivery/yhqm/74gHlK2Mrc7YL5dnnjopehWLftlfSA8449R6lECKI4OhjN9mA/out-0.webp"
]
```


### Example (https://replicate.com/p/9h5pyvddzdrm40cj1jwbxp5jhg)

#### Input

```json
{
  "prompt": "Three magical wizards standing on a yellow table, each holding a sign. On the left, a wizard in black robes holds a sign that says \u2018AI\u2019; in the middle, a witch in red robes holds a sign that says \u2018is\u2019; and on the right, a wizard in blue robes holds a sign that says \u2018cool\u2019",
  "go_fast": true,
  "num_outputs": 1,
  "aspect_ratio": "1:1",
  "output_format": "webp",
  "output_quality": 80
}
```

#### Output

```json
[
  "https://replicate.delivery/yhqm/ocz3puvUrqrINZtxGrnbqEhIevfWBbtfeiPEkMsJT3PsIb6NB/out-0.webp"
]
```


## Model readme

> ![](https://tjzk.replicate.delivery/markdownx/2cc9ad85-816b-4374-b3d3-cb4f06b49c3f.jpg)
> 
> `FLUX.1 [schnell]` is a 12 billion parameter rectified flow transformer capable of generating images from text descriptions.
> For more information, please read our [blog post](https://blackforestlabs.ai/announcing-black-forest-labs/).
> 
> # Key Features
> 1. Cutting-edge output quality and competitive prompt following, matching the performance of closed source alternatives.
> 2. Trained using latent adversarial diffusion distillation, `FLUX.1 [schnell]` can generate high-quality images in only 1 to 4 steps.
> 3. Released under the `apache-2.0` licence, the model can be used for personal, scientific, and commercial purposes.
> 
> # Usage
> We provide a reference implementation of `FLUX.1 [schnell]`, as well as sampling code, in a dedicated [github repository](https://github.com/black-forest-labs/flux).
> Developers and creatives looking to build on top of `FLUX.1 [schnell]` are encouraged to use this as a starting point.
> 
> ## ComfyUI
> `FLUX.1 [schnell]` is also available in [Comfy UI](https://github.com/comfyanonymous/ComfyUI) for local inference with a node-based workflow.
> 
> # Limitations
> - This model is not intended or able to provide factual information.
> - As a statistical model this checkpoint might amplify existing societal biases.
> - The model may fail to generate output that matches the prompts.
> - Prompt following is heavily influenced by the prompting-style.
> 
> # Out-of-Scope Use
> The model and its derivatives may not be used
> 
> - In any way that violates any applicable national, federal, state, local or international law or regulation.
> - For the purpose of exploiting, harming or attempting to exploit or harm minors in any way; including but not limited to the solicitation, creation, acquisition, or dissemination of child exploitative content.
> - To generate or disseminate verifiably false information and/or content with the purpose of harming others.
> - To generate or disseminate personal identifiable information that can be used to harm an individual.
> - To harass, abuse, threaten, stalk, or bully individuals or groups of individuals.
> - To create non-consensual nudity or illegal pornographic content.
> - For fully automated decision making that adversely impacts an individual's legal rights or otherwise creates or modifies a binding, enforceable obligation.
> - Generating or facilitating large-scale disinformation campaigns.
> 
> # Accelerated Inference
> We provide a `go_fast` flag within the API which toggles a version of flux-schnell optimized for inference. Currently this version is a compiled fp8 quantization with an optimized attention kernel. We'll update the model and this documentation as we develop further enhancements.

