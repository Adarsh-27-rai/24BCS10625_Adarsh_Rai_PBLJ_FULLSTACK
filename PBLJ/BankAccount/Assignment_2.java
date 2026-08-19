package BankAccount;

class BankAccount {
    String AccountNumber;
    double balance;

    BankAccount(String AccountNumber, double balance) {
        this.AccountNumber = AccountNumber;
        if(balance >= 0) {
            this.balance = balance;
        } else {
            this.balance = 0;
        }
    }

    double getBalance() {
        return this.balance;
    }

    void setBalance(double balance) {
        if(balance >= 0) {
            this.balance = balance;
        }
    }

    void deposit(double amount) {
        if(amount > 0) {
            this.balance += amount;
        } else {
            System.out.println("Amount is invalid! ");
        }
    }

    void withdraw(double amount) {
        if(amount > 0 && amount <= this.balance) {
            this.balance -= amount;
        } else {
            System.out.println("Amount is invalid! ");
        }
    }


}

public class Assignment_2 {
    public static void main(String[] args) {
        BankAccount acc = new BankAccount("123", 400000);
        System.out.println(acc.getBalance());

        acc.setBalance(500000);
        System.out.println(acc.getBalance());

        acc.deposit(10000);
        System.out.println(acc.getBalance());

        acc.deposit(-10000);

        acc.withdraw(10000);
        System.out.println(acc.getBalance());

        acc.withdraw(1000000);
        System.out.println(acc.getBalance());
    }
}
