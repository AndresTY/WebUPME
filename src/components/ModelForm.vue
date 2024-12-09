<template>
    <div class="container">
        <section class="QuestionSection">
            <div class="input-container">
                <input type="text" id="input" required="" v-model="question">
                <label for="input" class="label">Escribe la pregunta</label>
                <div class="underline"></div>
            </div>
            <br>
            <button @click="handleQuestion()" :disabled="isLoading">
                <div class="svg-wrapper-1">
                    <div class="svg-wrapper">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                            <path fill="none" d="M0 0h24v24H0z"></path>
                            <path fill="currentColor"
                                d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z">
                            </path>
                        </svg>
                    </div>
                </div>
                <span>Enviar</span>
            </button>
        </section>

        <section class="ResponseSection">
            <div class="task">
                <div class="tags">
                    <span :class="['tag', { 'error': isError }]">Respuesta</span>
                </div>
                <section class="dots-container" v-if="isLoading">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </section>
                <p v-if="errorMessage">{{ errorMessage }}</p>
                <p v-else-if="response" v-html="response"></p>
                <p v-else></p>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { Ref, ref } from 'vue'
import { marked } from 'marked'

let question: Ref<string> = ref('')
let response: Ref<string> = ref<string | object | null>(null)

const errorMessage = ref<string>('');
const isError = ref<boolean>(false);
const isLoading = ref<boolean>(false);

const handleQuestion = async () => {
    isLoading.value = true;
    response.value = "";

    try {
        const rawResponse = await fetch('/api/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ qa: question.value, k: 7 }),
        });

        if (rawResponse.status === 400) {
            const errorData = await rawResponse.json();
            errorMessage.value = errorData.message || 'Error 400: Solicitud incorrecta';
            isError.value = true;
            isLoading.value = false;
            return;
        }

        if (!rawResponse.ok) {
            throw new Error(`HTTP error! Status: ${rawResponse.status}`);
        }

        const res = await rawResponse.json();
        const markdownText = res.predict;
        const htmlContent = marked(markdownText);

        response.value = htmlContent;
        isError.value = false;
        errorMessage.value = '';
    } catch (error) {
        console.error('Error en la solicitud:', error);
        errorMessage.value = 'Ocurrió un error inesperado';
        isError.value = true;
    } finally {
        isLoading.value = false;
    }
};
</script>


<style scoped>
.container {
    display: flex;
    justify-content: space-between;
    gap: 30px;
}

.QuestionSection,
.ResponseSection {
    flex: 1;
}

.task {
    position: relative;
    color: #2e2e2f;
    cursor: text;
    background-color: #fff;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: rgba(99, 99, 99, 0.1) 0px 2px 8px 0px;
    margin-bottom: 1rem;
    border: 3px dashed transparent;
    max-width: 500px;
}


.task p {
    font-size: 15px;
    margin: 1.2rem 0;
}

.tag {
    border-radius: 100px;
    padding: 4px 13px;
    font-size: 12px;
    color: #ffffff;
    background-color: #1389eb;
}

.tag.error {
    border-radius: 100px;
    padding: 4px 13px;
    font-size: 12px;
    color: #ffffff;
    background-color: #eb1313;
}

.tags {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

button {
    font-family: inherit;
    font-size: 20px;
    background: royalblue;
    color: white;
    padding: 0.7em 1em;
    display: inline-flex;
    align-items: center;
    border: none;
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.2s;
    cursor: pointer;
}

button span {
    display: block;
    margin-left: 0.3em;
    transition: all 0.3s ease-in-out;
}

button svg {
    display: block;
    transform-origin: center center;
    transition: transform 0.3s ease-in-out;
}

button:hover .svg-wrapper {
    animation: fly-1 0.6s ease-in-out infinite alternate;
}

button:hover svg {
    transform: translateX(1.2em) rotate(45deg) scale(1.1);
}

button:hover span {
    transform: translateX(5em);
}

button:active {
    transform: scale(0.95);
}

@keyframes fly-1 {
    from {
        transform: translateY(0.1em);
    }

    to {
        transform: translateY(-0.1em);
    }
}

/* From Uiverse.io by Satwinder04 */
.input-container {
    position: relative;
    margin: 50px auto;
    width: 500px;
}

.input-container input[type="text"] {
    font-size: 20px;
    width: 100%;
    border: none;
    border-bottom: 2px solid #ccc;
    padding: 5px 0;
    background-color: transparent;
    outline: none;
}

.input-container .label {
    position: absolute;
    top: 0;
    left: 0;
    color: #ccc;
    transition: all 0.3s ease;
    pointer-events: none;
}

.input-container input[type="text"]:focus~.label,
.input-container input[type="text"]:valid~.label {
    top: -20px;
    font-size: 16px;
    color: #333;
}

.input-container .underline {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 100%;
    background-color: #333;
    transform: scaleX(0);
    transition: all 0.3s ease;
}

.input-container input[type="text"]:focus~.underline,
.input-container input[type="text"]:valid~.underline {
    transform: scaleX(1);
}

/* From Uiverse.io by adamgiebl */
.dots-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
}

.dot {
    height: 20px;
    width: 20px;
    margin-right: 10px;
    border-radius: 10px;
    background-color: #b3d4fc;
    animation: pulse 1.5s infinite ease-in-out;
}

.dot:last-child {
    margin-right: 0;
}

.dot:nth-child(1) {
    animation-delay: -0.3s;
}

.dot:nth-child(2) {
    animation-delay: -0.1s;
}

.dot:nth-child(3) {
    animation-delay: 0.1s;
}

@keyframes pulse {
    0% {
        transform: scale(0.8);
        background-color: #b3d4fc;
        box-shadow: 0 0 0 0 rgba(178, 212, 252, 0.7);
    }

    50% {
        transform: scale(1.2);
        background-color: #6793fb;
        box-shadow: 0 0 0 10px rgba(178, 212, 252, 0);
    }

    100% {
        transform: scale(0.8);
        background-color: #b3d4fc;
        box-shadow: 0 0 0 0 rgba(178, 212, 252, 0.7);
    }
}
</style>