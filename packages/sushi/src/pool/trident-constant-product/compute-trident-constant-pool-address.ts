import { defaultAbiCoder } from '@ethersproject/abi'
import { getCreate2Address } from '@ethersproject/address'
import { keccak256 } from '@ethersproject/solidity'
import { Token } from '../../currency/index.js'
import { Fee } from '../../dex/index.js'

export const computeTridentConstantPoolAddress = ({
  factoryAddress,
  tokenA,
  tokenB,
  fee,
  twap,
}: {
  factoryAddress: string
  tokenA: Token
  tokenB: Token
  fee: Fee
  twap: boolean
}): string => {
  // does safety checks
  const [token0, token1] = tokenA.sortsBefore(tokenB)
    ? [tokenA, tokenB]
    : [tokenB, tokenA]

  const deployData = defaultAbiCoder.encode(
    ['address', 'address', 'uint256', 'bool'],
    [token0.address, token1.address, fee, twap],
  )

  const CONSTANT_PRODUCT_POOL_INIT_CODE_HASH = keccak256(
    ['bytes'],
    [
      '0x6101a060405260016006553480156200001757600080fd5b50604080518082018252601f81527f537573686920436f6e7374616e742050726f64756374204c5020546f6b656e0060208083019182528351808501909452600584526405343504c560dc1b9084015281519192916012916200007e91600091906200042d565b508151620000949060019060208501906200042d565b5060ff81166080524660a052620000aa62000391565b60c08181525050505050600080336001600160a01b031663d039f6226040518163ffffffff1660e01b8152600401600060405180830381865afa158015620000f6573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405262000120919081019062000514565b915091506000806000808580602001905181019062000140919062000605565b929650909450925090506001600160a01b038416620001725760405163d92e233d60e01b815260040160405180910390fd5b826001600160a01b0316846001600160a01b03161415620001a65760405163065af08d60e01b815260040160405180910390fd5b612710821115620001ca5760405163da7459b760e01b815260040160405180910390fd5b6001600160a01b03808516610160528381166101805260e083905261271083900361010052604080516360a56c0160e11b815290519187169163c14ad802916004808201926020929091908290030181865afa1580156200022f573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019062000255919062000665565b600781905550846001600160a01b0316630c0a0cd26040518163ffffffff1660e01b8152600401602060405180830381865afa1580156200029a573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620002c091906200067f565b600860006101000a8154816001600160a01b0302191690836001600160a01b03160217905550846001600160a01b0316634da318276040518163ffffffff1660e01b8152600401602060405180830381865afa15801562000325573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906200034b91906200067f565b6001600160a01b039081166101205285166101405280156200038557600c80546001600160e01b0316600160e01b4263ffffffff16021790555b50505050505062000787565b60007f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f6000604051620003c59190620006e3565b6040805191829003822060208301939093528101919091527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc660608201524660808201523060a082015260c00160405160208183030381529060405280519060200120905090565b8280546200043b90620006a6565b90600052602060002090601f0160209004810192826200045f5760008555620004aa565b82601f106200047a57805160ff1916838001178555620004aa565b82800160010185558215620004aa579182015b82811115620004aa5782518255916020019190600101906200048d565b50620004b8929150620004bc565b5090565b5b80821115620004b85760008155600101620004bd565b634e487b7160e01b600052604160045260246000fd5b6001600160a01b0381168114620004ff57600080fd5b50565b80516200050f81620004e9565b919050565b600080604083850312156200052857600080fd5b82516001600160401b03808211156200054057600080fd5b818501915085601f8301126200055557600080fd5b8151818111156200056a576200056a620004d3565b604051601f8201601f19908116603f01168101908382118183101715620005955762000595620004d3565b81604052828152602093508884848701011115620005b257600080fd5b600091505b82821015620005d65784820184015181830185015290830190620005b7565b82821115620005e85760008484830101525b9550620005fa91505085820162000502565b925050509250929050565b600080600080608085870312156200061c57600080fd5b84516200062981620004e9565b60208601519094506200063c81620004e9565b60408601516060870151919450925080151581146200065a57600080fd5b939692955090935050565b6000602082840312156200067857600080fd5b5051919050565b6000602082840312156200069257600080fd5b81516200069f81620004e9565b9392505050565b600181811c90821680620006bb57607f821691505b60208210811415620006dd57634e487b7160e01b600052602260045260246000fd5b50919050565b600080835481600182811c9150808316806200070057607f831692505b60208084108214156200072157634e487b7160e01b86526022600452602486fd5b8180156200073857600181146200074a5762000779565b60ff1986168952848901965062000779565b60008a81526020902060005b86811015620007715781548b82015290850190830162000756565b505084890196505b509498975050505050505050565b60805160a05160c05160e0516101005161012051610140516101605161018051613bad62000909600039600081816105ac015281816107df015281816108de0152818161098c015281816110350152818161113d015281816112f2015281816115d3015281816116420152818161195a01528181611aaa01528181611f03015281816121e40152818161226b0152612bb90152600081816103290152818161075b01528181610a4101528181610b4001528181611009015281816110d4015281816113780152818161157f015281816116f30152818161186301528181611a3c01528181611e84015281816122a00152818161235b0152612ade0152600081816105850152818161273e01526127d3015260008181610407015281816118b0015281816119a20152818161297101528181612a3e01528181612b110152612bea0152600081816128af01526131d601526000818161042e0152818161329801526133030152600061125901526000611224015260006103b30152613bad6000f3fe608060405234801561001057600080fd5b50600436106102415760003560e01c8063627dd56a11610145578063a8f1f52e116100bd578063cf58879a1161008c578063d505accf11610071578063d505accf146105ce578063dd62ed3e146105e3578063f1c49a391461060e57600080fd5b8063cf58879a14610580578063d21220a7146105a757600080fd5b8063a8f1f52e1461053e578063a9059cbb14610551578063af8c09bf14610564578063c14ad8021461057757600080fd5b80637464fc3d116101145780637ecebe00116100f95780637ecebe00146104ef57806395d89b411461050f578063a69840a81461051757600080fd5b80637464fc3d146104d35780637ba0e2e7146104dc57600080fd5b8063627dd56a1461046257806365dfc7671461047557806367e4ac2c1461049e57806370a08231146104b357600080fd5b80632a07b6c7116101d8578063499a3c50116101a757806354cf2aeb1161018c57806354cf2aeb146104295780635909c0d5146104505780635a3d54931461045957600080fd5b8063499a3c50146103ef5780634da318271461040257600080fd5b80632a07b6c71461036757806330adf81f14610387578063313ce567146103ae5780633644e515146103e757600080fd5b80630c0a0cd2116102145780630c0a0cd2146102df5780630dfe16811461032457806318160ddd1461034b57806323b872dd1461035457600080fd5b8063053da1c81461024657806306fdde031461026c5780630902f1ac14610281578063095ea7b3146102bc575b600080fd5b6102596102543660046133b1565b610616565b6040519081526020015b60405180910390f35b610274610bfc565b604051610263919061348e565b610289610c8a565b604080516dffffffffffffffffffffffffffff948516815293909216602084015263ffffffff1690820152606001610263565b6102cf6102ca3660046134cd565b610cf3565b6040519015158152602001610263565b6008546102ff9073ffffffffffffffffffffffffffffffffffffffff1681565b60405173ffffffffffffffffffffffffffffffffffffffff9091168152602001610263565b6102ff7f000000000000000000000000000000000000000000000000000000000000000081565b61025960025481565b6102cf6103623660046134f9565b610d6c565b61037a6103753660046133b1565b610eb0565b604051610263919061353a565b6102597f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c981565b6103d57f000000000000000000000000000000000000000000000000000000000000000081565b60405160ff9091168152602001610263565b610259611220565b6102596103fd3660046133b1565b61127b565b6102ff7f000000000000000000000000000000000000000000000000000000000000000081565b6102597f000000000000000000000000000000000000000000000000000000000000000081565b61025960095481565b610259600a5481565b6102596104703660046133b1565b611433565b61047d6117c4565b60408051938452602084019290925263ffffffff1690820152606001610263565b6104a6611a1a565b604051610263919061359f565b6102596104c13660046135f9565b60036020526000908152604090205481565b610259600b5481565b6102596104ea3660046133b1565b611b19565b6102596104fd3660046135f9565b60056020526000908152604090205481565b610274611e00565b6102597f54726964656e743a436f6e7374616e7450726f6475637400000000000000000081565b61025961054c3660046133b1565b611e0d565b6102cf61055f3660046134cd565b611fb1565b6102596105723660046133b1565b612036565b61025960075481565b6102ff7f000000000000000000000000000000000000000000000000000000000000000081565b6102ff7f000000000000000000000000000000000000000000000000000000000000000081565b6105e16105dc366004613616565b612410565b005b6102596105f136600461368d565b600460209081526000928352604080842090915290825290205481565b6105e161273c565b6000600654600114610689576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600a60248201527f5245454e5452414e43590000000000000000000000000000000000000000000060448201526064015b60405180910390fd5b60026006556000808080806106a087890189613705565b945094509450945094506000806000610708600c546dffffffffffffffffffffffffffff808216926e01000000000000000000000000000083049091169163ffffffff7c01000000000000000000000000000000000000000000000000000000009091041690565b925092509250826dffffffffffffffffffffffffffff1660001415610759576040517fd886367700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168873ffffffffffffffffffffffffffffffffffffffff16141561098a576107d885846dffffffffffffffffffffffffffff16846dffffffffffffffffffffffffffff166128a7565b98506108067f00000000000000000000000000000000000000000000000000000000000000008a898961290a565b6040517fbd50c7b1000000000000000000000000000000000000000000000000000000008152339063bd50c7b19061084290879060040161348e565b600060405180830381600087803b15801561085c57600080fd5b505af1158015610870573d6000803e3d6000fd5b5050505060008061087f612aa1565b9150915086856dffffffffffffffffffffffffffff16830310156108cf576040517fdf5b2ee600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6108dc8282878787612c5d565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168a73ffffffffffffffffffffffffffffffffffffffff168a73ffffffffffffffffffffffffffffffffffffffff167fcd3829a3813dc3cdd188fd3d01dcf3268c16be2fdd2dd21d0665418816e460628a8f60405161097b929190918252602082015260400190565b60405180910390a45050610be8565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168873ffffffffffffffffffffffffffffffffffffffff1614610a0f576040517f2df9739b00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b610a3a85836dffffffffffffffffffffffffffff16856dffffffffffffffffffffffffffff166128a7565b9850610a687f00000000000000000000000000000000000000000000000000000000000000008a898961290a565b6040517fbd50c7b1000000000000000000000000000000000000000000000000000000008152339063bd50c7b190610aa490879060040161348e565b600060405180830381600087803b158015610abe57600080fd5b505af1158015610ad2573d6000803e3d6000fd5b50505050600080610ae1612aa1565b9150915086846dffffffffffffffffffffffffffff1682031015610b31576040517fdf5b2ee600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b610b3e8282878787612c5d565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168a73ffffffffffffffffffffffffffffffffffffffff168a73ffffffffffffffffffffffffffffffffffffffff167fcd3829a3813dc3cdd188fd3d01dcf3268c16be2fdd2dd21d0665418816e460628a8f604051610bdd929190918252602082015260400190565b60405180910390a450505b505060016006555094979650505050505050565b60008054610c0990613814565b80601f0160208091040260200160405190810160405280929190818152602001828054610c3590613814565b8015610c825780601f10610c5757610100808354040283529160200191610c82565b820191906000526020600020905b815481529060010190602001808311610c6557829003601f168201915b505050505081565b6000806000610ce8600c546dffffffffffffffffffffffffffff808216926e01000000000000000000000000000083049091169163ffffffff7c01000000000000000000000000000000000000000000000000000000009091041690565b925092509250909192565b33600081815260046020908152604080832073ffffffffffffffffffffffffffffffffffffffff8716808552925280832085905551919290917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92590610d5b9086815260200190565b60405180910390a350600192915050565b73ffffffffffffffffffffffffffffffffffffffff831660009081526004602090815260408083203384529091528120547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8114610e0057610dce8382613897565b73ffffffffffffffffffffffffffffffffffffffff861660009081526004602090815260408083203384529091529020555b73ffffffffffffffffffffffffffffffffffffffff851660009081526003602052604081208054859290610e35908490613897565b909155505073ffffffffffffffffffffffffffffffffffffffff808516600081815260036020526040908190208054870190555190918716907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef90610e9d9087815260200190565b60405180910390a3506001949350505050565b6060600654600114610f1e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600a60248201527f5245454e5452414e4359000000000000000000000000000000000000000000006044820152606401610680565b6002600655600080610f32848601866138ae565b915091506000806000610f94600c546dffffffffffffffffffffffffffff808216926e01000000000000000000000000000083049091169163ffffffff7c01000000000000000000000000000000000000000000000000000000009091041690565b925092509250600080610fa5612aa1565b30600090815260036020526040812054929450909250610fc58787612f0a565b509050600081610fd586856138e3565b610fdf919061394f565b9050600082610fee86866138e3565b610ff8919061394f565b90506110043085612fe9565b6110307f0000000000000000000000000000000000000000000000000000000000000000838d8d61290a565b61105c7f0000000000000000000000000000000000000000000000000000000000000000828d8d61290a565b8186039550808503945061107386868b8b8b612c5d565b61108561108086886138e3565b61307f565b600b556040805160028082526060820190925290816020015b604080518082019091526000808252602082015281526020019060019003908161109e579050509b5060405180604001604052807f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168152602001838152508c6000815181106111255761112561398a565b602002602001018190525060405180604001604052807f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168152602001828152508c60018151811061118e5761118e61398a565b60200260200101819052508a73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fdccd412f0b1252819cb1fd330b93224ca42612892bb3f4f789976e6d819364968484604051611201929190918252602082015260400190565b60405180910390a35050600160065550979a9950505050505050505050565b60007f0000000000000000000000000000000000000000000000000000000000000000461461125657611251613138565b905090565b507f000000000000000000000000000000000000000000000000000000000000000090565b6000808061128b848601866134cd565b915091506000806112eb600c546dffffffffffffffffffffffffffff808216926e01000000000000000000000000000083049091169163ffffffff7c01000000000000000000000000000000000000000000000000000000009091041690565b50915091507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1614156113765761136f83836dffffffffffffffffffffffffffff16836dffffffffffffffffffffffffffff166131d2565b9450611429565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff16146113fb576040517f0620202000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b61142683826dffffffffffffffffffffffffffff16846dffffffffffffffffffffffffffff166131d2565b94505b5050505092915050565b60006006546001146114a1576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600a60248201527f5245454e5452414e4359000000000000000000000000000000000000000000006044820152606401610680565b6002600655600080806114b6858701876139b9565b925092509250600080600061151a600c546dffffffffffffffffffffffffffff808216926e01000000000000000000000000000083049091169163ffffffff7c01000000000000000000000000000000000000000000000000000000009091041690565b925092509250826dffffffffffffffffffffffffffff166000141561156b576040517fd886367700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600080611576612aa1565b915091506000807f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168a73ffffffffffffffffffffffffffffffffffffffff161415611640577f00000000000000000000000000000000000000000000000000000000000000009050866dffffffffffffffffffffffffffff168403915061163482886dffffffffffffffffffffffffffff16886dffffffffffffffffffffffffffff166128a7565b9a508a8303925061172c565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168a73ffffffffffffffffffffffffffffffffffffffff16146116c5576040517f2df9739b00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5050600c546dffffffffffffffffffffffffffff6e01000000000000000000000000000090910481168203907f000000000000000000000000000000000000000000000000000000000000000090611724908390888116908a166128a7565b9a508a840393505b611738818c8b8b61290a565b6117458484898989612c5d565b8073ffffffffffffffffffffffffffffffffffffffff168a73ffffffffffffffffffffffffffffffffffffffff168a73ffffffffffffffffffffffffffffffffffffffff167fcd3829a3813dc3cdd188fd3d01dcf3268c16be2fdd2dd21d0665418816e46062858f604051610bdd929190918252602082015260400190565b600080600080600080611826600c546dffffffffffffffffffffffffffff808216926e01000000000000000000000000000083049091169163ffffffff7c01000000000000000000000000000000000000000000000000000000009091041690565b6040517f5662311800000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000811660048301526dffffffffffffffffffffffffffff851660248301526000604483015293965091945092507f000000000000000000000000000000000000000000000000000000000000000090911690635662311890606401602060405180830381865afa1580156118f9573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061191d9190613a00565b6040517f5662311800000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000811660048301526dffffffffffffffffffffffffffff85166024830152600060448301529197507f000000000000000000000000000000000000000000000000000000000000000090911690635662311890606401602060405180830381865afa1580156119eb573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611a0f9190613a00565b959690945092505050565b60408051600280825260608083018452926020830190803683370190505090507f000000000000000000000000000000000000000000000000000000000000000081600081518110611a6e57611a6e61398a565b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff16815250507f000000000000000000000000000000000000000000000000000000000000000081600181518110611adc57611adc61398a565b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff168152505090565b6000600654600114611b87576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600a60248201527f5245454e5452414e4359000000000000000000000000000000000000000000006044820152606401610680565b60026006556000611b9a838501856135f9565b90506000806000611bfa600c546dffffffffffffffffffffffffffff808216926e01000000000000000000000000000083049091169163ffffffff7c01000000000000000000000000000000000000000000000000000000009091041690565b925092509250600080611c0b612aa1565b90925090506000611c1f61108083856138e3565b90506000611c3d6dffffffffffffffffffffffffffff881685613897565b90506000611c5b6dffffffffffffffffffffffffffff881685613897565b9050600080611c8c84848c6dffffffffffffffffffffffffffff168c6dffffffffffffffffffffffffffff1661323d565b9092509050611c9b828b613a19565b9950611ca7818a613a19565b9850600080611cb68c8c612f0a565b915091508160001415611d2557851580611cce575084155b15611d05576040517fd856fc5a00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b611d116103e888613897565b9d50611d2060006103e8613340565b611d41565b80870381611d3384836138e3565b611d3d919061394f565b9e50505b8d611d78576040517fd226f9d400000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b611d828d8f613340565b611d8f89898e8e8e612c5d565b600b879055604080518781526020810187905273ffffffffffffffffffffffffffffffffffffffff8f169133917fdbba30eb0402b389513e87f51f4db2db80bed454384ec6925a24097c3548a02a910160405180910390a35050600160065550999c9b505050505050505050505050565b60018054610c0990613814565b60008080611e1d848601866134cd565b91509150600080611e7d600c546dffffffffffffffffffffffffffff808216926e01000000000000000000000000000083049091169163ffffffff7c01000000000000000000000000000000000000000000000000000000009091041690565b50915091507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161415611f015761136f83836dffffffffffffffffffffffffffff16836dffffffffffffffffffffffffffff166128a7565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1614611f86576040517f2df9739b00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b61142683826dffffffffffffffffffffffffffff16846dffffffffffffffffffffffffffff166128a7565b33600090815260036020526040812080548391908390611fd2908490613897565b909155505073ffffffffffffffffffffffffffffffffffffffff8316600081815260036020526040908190208054850190555133907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef90610d5b9086815260200190565b60006006546001146120a4576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600a60248201527f5245454e5452414e4359000000000000000000000000000000000000000000006044820152606401610680565b6002600655600080806120b9858701876139b9565b925092509250600080600061211d600c546dffffffffffffffffffffffffffff808216926e01000000000000000000000000000083049091169163ffffffff7c01000000000000000000000000000000000000000000000000000000009091041690565b30600090815260036020526040812054939650919450925061213f8585612f0a565b50905060008161215f6dffffffffffffffffffffffffffff8816856138e3565b612169919061394f565b90506000826121886dffffffffffffffffffffffffffff8816866138e3565b612192919061394f565b90506121d56121b1826dffffffffffffffffffffffffffff8916613897565b6121cb846dffffffffffffffffffffffffffff8b16613897565b61108091906138e3565b600b556121e23085612fe9565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168a73ffffffffffffffffffffffffffffffffffffffff16141561229e576122658283896dffffffffffffffffffffffffffff160383896dffffffffffffffffffffffffffff16036128a7565b016122927f0000000000000000000000000000000000000000000000000000000000000000828b8b61290a565b809a5060009150612389565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168a73ffffffffffffffffffffffffffffffffffffffff1614612323576040517f0620202000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6123528182886dffffffffffffffffffffffffffff1603848a6dffffffffffffffffffffffffffff16036128a7565b820191506123827f0000000000000000000000000000000000000000000000000000000000000000838b8b61290a565b5098508860005b600080612394612aa1565b915091506123a582828b8b8b612c5d565b604080518581526020810185905273ffffffffffffffffffffffffffffffffffffffff8d169133917fdccd412f0b1252819cb1fd330b93224ca42612892bb3f4f789976e6d81936496910160405180910390a35050600160065550989b9a5050505050505050505050565b4284101561247a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601760248201527f5045524d49545f444541444c494e455f455850495245440000000000000000006044820152606401610680565b6000612484611220565b73ffffffffffffffffffffffffffffffffffffffff89811660008181526005602090815260409182902080546001810190915582517f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c98184015280840194909452938c166060840152608083018b905260a083019390935260c08083018a90528151808403909101815260e0830190915280519201919091207f190100000000000000000000000000000000000000000000000000000000000061010083015261010282019290925261012281019190915261014201604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181528282528051602091820120600080855291840180845281905260ff88169284019290925260608301869052608083018590529092509060019060a0016020604051602081039080840390855afa1580156125e3573d6000803e3d6000fd5b50506040517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0015191505073ffffffffffffffffffffffffffffffffffffffff81161580159061265e57508873ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16145b6126c4576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600e60248201527f494e56414c49445f5349474e45520000000000000000000000000000000000006044820152606401610680565b73ffffffffffffffffffffffffffffffffffffffff90811660009081526004602090815260408083208b8516808552908352928190208a905551898152919350918a16917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a350505050505050565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663c14ad8026040518163ffffffff1660e01b8152600401602060405180830381865afa1580156127a7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906127cb9190613a00565b6007819055507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16630c0a0cd26040518163ffffffff1660e01b8152600401602060405180830381865afa15801561283c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906128609190613a4b565b600880547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff92909216919091179055565b6000806128d47f0000000000000000000000000000000000000000000000000000000000000000866138e3565b9050806128e3612710866138e3565b6128ed9190613a68565b6128f784836138e3565b612901919061394f565b95945050505050565b80156129e4576040517f97da6d3000000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff8581166004830152306024830152838116604483015260006064830152608482018590527f000000000000000000000000000000000000000000000000000000000000000016906397da6d309060a40160408051808303816000875af11580156129b9573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906129dd9190613a80565b5050612a9b565b6040517ff18d03cc00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff85811660048301523060248301528381166044830152606482018590527f0000000000000000000000000000000000000000000000000000000000000000169063f18d03cc90608401600060405180830381600087803b158015612a8257600080fd5b505af1158015612a96573d6000803e3d6000fd5b505050505b50505050565b6040517ff7888aec00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000008116600483015230602483015260009182917f0000000000000000000000000000000000000000000000000000000000000000169063f7888aec90604401602060405180830381865afa158015612b58573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612b7c9190613a00565b6040517ff7888aec00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000811660048301523060248301529193507f00000000000000000000000000000000000000000000000000000000000000009091169063f7888aec90604401602060405180830381865afa158015612c33573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612c579190613a00565b90509091565b6dffffffffffffffffffffffffffff851180612c8657506dffffffffffffffffffffffffffff84115b15612cbd576040517f35278d1200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b63ffffffff8116612d1f57600c80546dffffffffffffffffffffffffffff8681166e010000000000000000000000000000027fffffffff0000000000000000000000000000000000000000000000000000000090921690881617179055612eca565b4263ffffffff80821690831614801590612d4857506dffffffffffffffffffffffffffff841615155b8015612d6357506dffffffffffffffffffffffffffff831615155b15612e285781810360006dffffffffffffffffffffffffffff86167bffffffffffffffffffffffffffff0000000000000000000000000000607087901b1681612dae57612dae613920565b600980549290910463ffffffff851681029092019055905060006dffffffffffffffffffffffffffff8616607088901b7bffffffffffffffffffffffffffff00000000000000000000000000001681612e0957612e09613920565b0490508263ffffffff168102600a600082825401925050819055505050505b600c805463ffffffff9092167c0100000000000000000000000000000000000000000000000000000000027bffffffffffffffffffffffffffffffffffffffffffffffffffffffff6dffffffffffffffffffffffffffff8881166e010000000000000000000000000000027fffffffff00000000000000000000000000000000000000000000000000000000909516908a161793909317929092169190911790555b60408051868152602081018690527fcf2aa50876cdfbb541206f89af0ee78d44a2abf8d328e37fa4917f982149848a910160405180910390a15050505050565b600254600b546000908015612fe157612f396110806dffffffffffffffffffffffffffff8087169088166138e3565b915080821115612fe157600754600081612f538486613897565b612f5d90876138e3565b612f6791906138e3565b90506000612f7584846138e3565b85612f8285612710613897565b612f8c91906138e3565b612f969190613a68565b90506000612fa4828461394f565b90508015612fdc57600854612fcf9073ffffffffffffffffffffffffffffffffffffffff1682613340565b612fd98188613a68565b96505b505050505b509250929050565b73ffffffffffffffffffffffffffffffffffffffff82166000908152600360205260408120805483929061301e908490613897565b909155505060028054829003905560405181815260009073ffffffffffffffffffffffffffffffffffffffff8416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef906020015b60405180910390a35050565b60b5817101000000000000000000000000000000000081106130a65760409190911b9060801c5b690100000000000000000081106130c25760209190911b9060401c5b6501000000000081106130da5760109190911b9060201c5b630100000081106130f05760089190911b9060101c5b62010000010260121c80820401600190811c80830401811c80830401811c80830401811c80830401811c80830401811c80830401901c8082048111156131335781045b919050565b60007f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f600060405161316a9190613aa4565b6040805191829003822060208301939093528101919091527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc660608201524660808201523060a082015260c00160405160208183030381529060405280519060200120905090565b60007f00000000000000000000000000000000000000000000000000000000000000006131ff8584613897565b61320991906138e3565b61271061321686866138e3565b61322091906138e3565b61322a919061394f565b613235906001613a68565b949350505050565b60008083158061324b575082155b1561325b57506000905080613337565b60008461326885896138e3565b613272919061394f565b90508581116132cd5761328861271060026138e3565b6132928288613897565b6132bc907f00000000000000000000000000000000000000000000000000000000000000006138e3565b6132c6919061394f565b9150613335565b6000846132da87896138e3565b6132e4919061394f565b90506132f361271060026138e3565b6132fd828a613897565b613327907f00000000000000000000000000000000000000000000000000000000000000006138e3565b613331919061394f565b9350505b505b94509492505050565b80600260008282546133529190613a68565b909155505073ffffffffffffffffffffffffffffffffffffffff82166000818152600360209081526040808320805486019055518481527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9101613073565b600080602083850312156133c457600080fd5b823567ffffffffffffffff808211156133dc57600080fd5b818501915085601f8301126133f057600080fd5b8135818111156133ff57600080fd5b86602082850101111561341157600080fd5b60209290920196919550909350505050565b6000815180845260005b818110156134495760208185018101518683018201520161342d565b8181111561345b576000602083870101525b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b6020815260006134a16020830184613423565b9392505050565b73ffffffffffffffffffffffffffffffffffffffff811681146134ca57600080fd5b50565b600080604083850312156134e057600080fd5b82356134eb816134a8565b946020939093013593505050565b60008060006060848603121561350e57600080fd5b8335613519816134a8565b92506020840135613529816134a8565b929592945050506040919091013590565b602080825282518282018190526000919060409081850190868401855b82811015613592578151805173ffffffffffffffffffffffffffffffffffffffff168552860151868501529284019290850190600101613557565b5091979650505050505050565b6020808252825182820181905260009190848201906040850190845b818110156135ed57835173ffffffffffffffffffffffffffffffffffffffff16835292840192918401916001016135bb565b50909695505050505050565b60006020828403121561360b57600080fd5b81356134a1816134a8565b600080600080600080600060e0888a03121561363157600080fd5b873561363c816134a8565b9650602088013561364c816134a8565b95506040880135945060608801359350608088013560ff8116811461367057600080fd5b9699959850939692959460a0840135945060c09093013592915050565b600080604083850312156136a057600080fd5b82356136ab816134a8565b915060208301356136bb816134a8565b809150509250929050565b8035801515811461313357600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080600080600060a0868803121561371d57600080fd5b8535613728816134a8565b94506020860135613738816134a8565b9350613746604087016136c6565b925060608601359150608086013567ffffffffffffffff8082111561376a57600080fd5b818801915088601f83011261377e57600080fd5b813581811115613790576137906136d6565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0908116603f011681019083821181831017156137d6576137d66136d6565b816040528281528b60208487010111156137ef57600080fd5b8260208601602083013760006020848301015280955050505050509295509295909350565b600181811c9082168061382857607f821691505b60208210811415613862577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000828210156138a9576138a9613868565b500390565b600080604083850312156138c157600080fd5b82356138cc816134a8565b91506138da602084016136c6565b90509250929050565b6000817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff048311821515161561391b5761391b613868565b500290565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b600082613985577f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b500490565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b6000806000606084860312156139ce57600080fd5b83356139d9816134a8565b925060208401356139e9816134a8565b91506139f7604085016136c6565b90509250925092565b600060208284031215613a1257600080fd5b5051919050565b60006dffffffffffffffffffffffffffff808316818516808303821115613a4257613a42613868565b01949350505050565b600060208284031215613a5d57600080fd5b81516134a1816134a8565b60008219821115613a7b57613a7b613868565b500190565b60008060408385031215613a9357600080fd5b505080516020909101519092909150565b600080835481600182811c915080831680613ac057607f831692505b6020808410821415613af9577f4e487b710000000000000000000000000000000000000000000000000000000086526022600452602486fd5b818015613b0d5760018114613b3c57613b69565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00861689528489019650613b69565b60008a81526020902060005b86811015613b615781548b820152908501908301613b48565b505084890196505b50949897505050505050505056fea2646970667358221220860e8cf8543ab713382b6536fca66307d46924b935d4b3b4d13f57dd57da62ae64736f6c634300080a0033',
    ],
  )

  // Compute pool address
  return getCreate2Address(
    factoryAddress,
    keccak256(['bytes'], [deployData]),
    CONSTANT_PRODUCT_POOL_INIT_CODE_HASH,
  )
}
