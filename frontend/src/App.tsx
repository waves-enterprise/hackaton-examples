import React from 'react';
import {Box, ChakraProvider} from "@chakra-ui/react";
import {SwapScreen} from "./screens/Swap";

function App() {


    return (
        <ChakraProvider>
            <Box w={'100%'} h={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                <SwapScreen/>
            </Box>
        </ChakraProvider>
    );
}

export default App;
