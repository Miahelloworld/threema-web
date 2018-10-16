/**
 * This file is part of Threema Web.
 *
 * Threema Web is free software: you can redistribute it and/or modify it
 * under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at
 * your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero
 * General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Threema Web. If not, see <http://www.gnu.org/licenses/>.
 */

export class TimeoutService {
    private logTag: string = '[TimeoutService]';

    // Angular services
    private $log: ng.ILogService;
    private $timeout: ng.ITimeoutService;

    // List of registered timeouts
    private timeouts: Set<ng.IPromise<any>> = new Set();

    public static $inject = ['$log', '$timeout'];
    constructor($log: ng.ILogService, $timeout: ng.ITimeoutService) {
        // Angular services
        this.$log = $log;
        this.$timeout = $timeout;
    }

    /**
     * Register a timeout.
     */
    public register<T>(fn: (...args: any[]) => T, delay: number, invokeApply: boolean): ng.IPromise<T> {
        this.$log.debug(this.logTag, 'Registering timeout');
        const timeout = this.$timeout(fn, delay, invokeApply);
        timeout.finally(() => this.timeouts.delete(timeout));
        this.timeouts.add(timeout);
        return timeout;
    }

    /**
     * Cancel the specified timeout.
     *
     * Return true if the task hasn't executed yet and was successfully canceled.
     */
    public cancel<T>(timeout: ng.IPromise<T>): boolean {
        this.$log.debug(this.logTag, 'Cancelling timeout');
        const cancelled = this.$timeout.cancel(timeout);
        this.timeouts.delete(timeout);
        return cancelled;
    }

    /**
     * Cancel all pending timeouts.
     */
    public cancelAll() {
        this.$log.debug(this.logTag, 'Cancelling all timeouts');
        for (const timeout of this.timeouts) {
            this.$timeout.cancel(timeout);
        }
        this.timeouts.clear();
    }
}
