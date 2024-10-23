// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract CryptoLoan is ReentrancyGuard {
    struct Loan {
        uint256 amount;
        uint256 collateralAmount;
        uint256 duration;
        uint256 interestRate;
        uint256 startTime;
        bool active;
        bool repaid;
    }

    mapping(address => Loan[]) public loans;
    IERC20 public collateralToken;
    address public owner;

    event LoanRequested(address borrower, uint256 amount, uint256 collateralAmount, uint256 duration);
    event LoanApproved(address borrower, uint256 loanId);
    event LoanRepaid(address borrower, uint256 loanId);

    constructor(address _collateralToken) {
        collateralToken = IERC20(_collateralToken);
        owner = msg.sender;
    }

    function requestLoan(uint256 _amount, uint256 _collateralAmount, uint256 _duration) external nonReentrant {
        require(_amount > 0, "Loan amount must be greater than 0");
        require(_collateralAmount > 0, "Collateral amount must be greater than 0");
        require(_duration > 0, "Loan duration must be greater than 0");

        require(collateralToken.transferFrom(msg.sender, address(this), _collateralAmount), "Collateral transfer failed");

        loans[msg.sender].push(Loan({
            amount: _amount,
            collateralAmount: _collateralAmount,
            duration: _duration,
            interestRate: 5, // 5% interest rate, can be made dynamic
            startTime: 0,
            active: false,
            repaid: false
        }));

        emit LoanRequested(msg.sender, _amount, _collateralAmount, _duration);
    }

    function approveLoan(address _borrower, uint256 _loanId) external onlyOwner {
        require(_loanId < loans[_borrower].length, "Invalid loan ID");
        Loan storage loan = loans[_borrower][_loanId];
        require(!loan.active, "Loan is already active");

        loan.active = true;
        loan.startTime = block.timestamp;

        emit LoanApproved(_borrower, _loanId);
    }

    function repayLoan(uint256 _loanId) external nonReentrant {
        require(_loanId < loans[msg.sender].length, "Invalid loan ID");
        Loan storage loan = loans[msg.sender][_loanId];
        require(loan.active, "Loan is not active");
        require(!loan.repaid, "Loan is already repaid");

        uint256 repaymentAmount = loan.amount + (loan.amount * loan.interestRate / 100);
        require(collateralToken.transferFrom(msg.sender, address(this), repaymentAmount), "Repayment transfer failed");

        loan.repaid = true;
        require(collateralToken.transfer(msg.sender, loan.collateralAmount), "Collateral return failed");

        emit LoanRepaid(msg.sender, _loanId);
    }

    function getLoanCount(address _borrower) external view returns (uint256) {
        return loans[_borrower].length;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }
}