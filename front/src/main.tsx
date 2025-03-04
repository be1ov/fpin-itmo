import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {Provider} from "react-redux";
import {store} from "./redux/store.ts";

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <App />
    </Provider>,
)

console.log(`%c
            .--'''''''''--.
         .'      .---.      '.' 
        /    .-----------.    \\
       /        .-----.        \\
       |       .-.   .-.       |
       |      /   \\/    \\      |
        \\    | .-. | .-. |    /
         '-._| | | | | | |_.-' 
             | '-' | '-' | 
              \\___/ \\___/ 
           _.-'  /   \\  \`-._ 
         .' _.--|     |--._ '. 
         ' _...-|     |-..._ ' 
                |     | 
                '.___.'
                  | |
                 _| |_ 
                /\\( )/\\ 
               /  \` '  \\ 
              | |     | | 
              '-'     '-' 
              | |     | | 
              | |     | | 
              | |-----| | 
           .\`/  |     | |/\`. 
           |    |     |    | 
           '._.'| .-. |'._.' 
                 \\ | / 
                 | | | 
                 | | | 
                 | | | 
                /| | |\\ 
              .'_| | |_.'.
              \`. | | | .' 
           .    /  |  \\    . 
          /o\`.-'  / \\  \`-.\`o\\ 
         /o  o\\ .'   \`. /o  o\\ 
         \`.___.'       \`.___.'

               SPONGEBOB.
     PUT YOUR DEVTOOLS AWAY, SPONGEBOB.    
WE ARE NOT TRYING TO HACK PIN.DB RIGHT NOW, 
               SPONGEBOB.  
`, "font-family:monospace");