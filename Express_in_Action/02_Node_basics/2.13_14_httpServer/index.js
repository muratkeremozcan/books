/** Covers Subscription part from the following:
 *
 * Feature 774678: Support a backoffice subscription type
 * https://bt-clmserver01.hqs.sbt.siemens.com/ccm/web/projects/CPS%20Horizon#action=com.ibm.team.workitem.viewWorkItem&id=774678
 * 
 * Specifically Story 777677
 * https://bt-clmserver01.hqs.sbt.siemens.com/ccm/web/projects/CPS%20Horizon#action=com.ibm.team.workitem.viewWorkItem&id=777677
 */
import { SubscriptionsPage } from "../../../elements/subscription/subscriptionsPage"
import * as localization from "../../../elements/subscription/localization"

Cypress.config('video', true)

describe('Sub  Feature: 774678', () => {
  describe('Handle open ended subscriptions feature', () => {
    before(() => {
      const username = Cypress.env("ECC_MANAGER_USERNAME")
      const password = Cypres