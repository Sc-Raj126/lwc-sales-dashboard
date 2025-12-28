import { LightningElement, track, wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';

export default class SalesDashboard extends LightningElement {
    @track accounts = [];
    @track filteredAccounts = [];
    @track searchKey = '';
    @track sortBy = 'Name';
    @track isLoading = false;
    @track error = null;

    @wire(getAccounts)
    wiredAccounts({ error, data }) {
        this.isLoading = false;
        if (data) {
            this.accounts = data;
            this.filteredAccounts = data;
            this.error = null;
        } else if (error) {
            this.error = error.body.message;
            this.accounts = [];
        }
    }

    handleSearchChange(event) {
        this.searchKey = event.target.value.toLowerCase();
        this.filterAccounts();
    }

    filterAccounts() {
        if (!this.searchKey) {
            this.filteredAccounts = this.accounts;
        } else {
            this.filteredAccounts = this.accounts.filter(acc =>
                acc.Name.toLowerCase().includes(this.searchKey) ||
                acc.BillingCity.toLowerCase().includes(this.searchKey)
            );
        }
    }

    handleSort(event) {
        this.sortBy = event.detail.fieldName;
        this.accounts.sort((a, b) => a[this.sortBy].localeCompare(b[this.sortBy]));
        this.filterAccounts();
    }

    get displayedAccounts() {
        return this.filteredAccounts.length > 0 ? this.filteredAccounts : [];
    }
}
