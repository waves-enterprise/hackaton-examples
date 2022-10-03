import * as React from 'react';
import {Box, Button, FormControl, FormLabel, Image, Input, Stack, Text} from "@chakra-ui/react";
import {TRANSACTION_TYPES, TRANSACTIONS} from "@wavesenterprise/transactions-factory";
import {sdk} from '../sdk';


const CONTRACT_ID = 'A1t23q7F6F3y2KE1ScgZLJErMcKazdLogCoTeVCkj1Ry'
const tokenId = 'AmL1n9b8NJtPcMALhN2CScDadLMBg48kEwux6Jg9Ar7J';

export function SwapScreen() {
    const [fromWest, setFromWest] = React.useState(false);

    const handleTx = async () => {
        await window.WEWallet.initialPromise

        const config: any = await sdk.node.config();

        const fee = config.minimumFee[TRANSACTION_TYPES.Transfer]

        const res = await window.WEWallet.publicState()

        const tx = TRANSACTIONS.Permit.V2({
            opType: 'add',
            role: 'contract_developer',
            fee: 1 * (10**8),
            senderPublicKey: await res.account.publicKey,
            target: '3NrPSwFyqs7D5s6MopJr4QqUKQMqni2mgqj',
            duplicate_timestamp: Date.now()
        })

        // const tx = TRANSACTIONS.CallContract.V5({
        //     contractId: CONTRACT_ID,
        //     params: [
        //         {
        //             key: 'action',
        //             value: 'swap',
        //             type: 'string'
        //         },
        //     ],
        //     senderPublicKey: res.account.publicKey,
        //     fee: fee,
        //     contractVersion: 1,
        //     payments: [
        //         fromWest
        //             ? {amount: 100000000}
        //             : {
        //                 assetId: tokenId,
        //                 amount: 100000
        //             }
        //         ,
        //     ]
        // })

        const signedTx = await window.WEWallet.signTx(tx);

        try {
            const res = await sdk.broadcastRaw(signedTx)

            console.log(res);
            // DO WAIT FOR TX
        } catch (e) {


        }

    }


    const west = (
        <FormControl>
            <FormLabel>WEST</FormLabel>
            <Input type='number' defaultValue={1}/>
        </FormControl>
    )

    const waves = (
        <FormControl>
            <FormLabel>WAVES</FormLabel>
            <Input type='number' defaultValue={1}/>
        </FormControl>
    )

    return (
        <Box w={'500px'} minH={'400px'} borderRadius={10} border={'1px solid'} borderColor={'green.500'} p={4}>
            <Text fontSize='2xl' fontWeight={800}>
                Swap
            </Text>


            <Stack spacing={4} mt={6}>
                {fromWest ? west : waves}

                <Box display={'flex'} justifyContent={'center'} cursor={'pointer'} onClick={() => {
                    setFromWest(r => !r)
                }}>
                    <Image src={'/swap.png'} w={'20px'} h={'20px'}/>
                </Box>

                {fromWest ? waves : west}
            </Stack>

            <Button width={'100%'} mt={6} size={'lg'} colorScheme={'green'} onClick={handleTx}>
                Swap
            </Button>
        </Box>
    )
}