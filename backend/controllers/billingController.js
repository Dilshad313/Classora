import Billing from '../models/Billing.js';
import { StatusCodes } from 'http-status-codes';

/**
 * Get billing information
 * @route GET /api/billing
 */
export const getBilling = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`📥 GET /api/billing for user: ${userId}`);
    
    const billing = await Billing.getOrCreate(userId);
    
    console.log('✅ Billing information retrieved');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Billing information retrieved successfully',
      data: billing
    });
  } catch (error) {
    console.error('❌ Get billing error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch billing information'
    });
  }
};

/**
 * Update billing information
 * @route PUT /api/billing
 */
export const updateBilling = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`📥 PUT /api/billing for user: ${userId}`);
    
    const {
      currency,
      billingAddress,
      paymentMethod
    } = req.body;

    let billing = await Billing.findOne({ userId });
    
    if (!billing) {
      billing = await Billing.create({ userId });
    }

    // Update fields
    if (currency) billing.currency = currency;
    if (billingAddress) billing.billingAddress = billingAddress;
    if (paymentMethod) billing.paymentMethod = paymentMethod;

    await billing.save();

    console.log('✅ Billing information updated');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Billing information updated successfully',
      data: billing
    });
  } catch (error) {
    console.error('❌ Update billing error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: errors[0] || 'Validation failed',
        errors: errors
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update billing information'
    });
  }
};

/**
 * Update subscription plan
 * @route PUT /api/billing/subscription
 */
export const updateSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const { plan, duration } = req.body; // duration in months
    
    console.log(`📥 PUT /api/billing/subscription for user: ${userId}`);

    if (!plan || !['FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE'].includes(plan)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid subscription plan'
      });
    }

    let billing = await Billing.findOne({ userId });
    
    if (!billing) {
      billing = await Billing.create({ userId });
    }

    // Update subscription
    billing.subscription.plan = plan;
    billing.subscription.status = 'active';
    billing.subscription.startDate = new Date();
    
    if (plan !== 'FREE' && duration) {
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + parseInt(duration));
      billing.subscription.expiryDate = expiryDate;
    } else {
      billing.subscription.expiryDate = null;
    }

    await billing.save();

    console.log('✅ Subscription updated');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Subscription updated successfully',
      data: billing
    });
  } catch (error) {
    console.error('❌ Update subscription error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update subscription'
    });
  }
};

/**
 * Cancel subscription
 * @route POST /api/billing/subscription/cancel
 */
export const cancelSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`📥 POST /api/billing/subscription/cancel for user: ${userId}`);

    const billing = await Billing.findOne({ userId });
    
    if (!billing) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Billing information not found'
      });
    }

    billing.subscription.status = 'cancelled';
    billing.subscription.autoRenew = false;
    
    await billing.save();

    console.log('✅ Subscription cancelled');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Subscription cancelled successfully',
      data: billing
    });
  } catch (error) {
    console.error('❌ Cancel subscription error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to cancel subscription'
    });
  }
};

/**
 * Get invoices
 * @route GET /api/billing/invoices
 */
export const getInvoices = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`📥 GET /api/billing/invoices for user: ${userId}`);
    
    const billing = await Billing.findOne({ userId });
    
    if (!billing) {
      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'No invoices found',
        data: []
      });
    }

    console.log('✅ Invoices retrieved');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Invoices retrieved successfully',
      data: billing.invoices || []
    });
  } catch (error) {
    console.error('❌ Get invoices error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch invoices'
    });
  }
};

/**
 * Add invoice
 * @route POST /api/billing/invoices
 */
export const addInvoice = async (req, res) => {
  try {
    const userId = req.user.id;
    const { invoiceNumber, amount, currency, status, pdfUrl } = req.body;
    
    console.log(`📥 POST /api/billing/invoices for user: ${userId}`);

    let billing = await Billing.findOne({ userId });
    
    if (!billing) {
      billing = await Billing.create({ userId, invoices: [] });
    }

    const invoice = {
      invoiceNumber,
      amount,
      currency: currency || billing.currency,
      status: status || 'paid',
      date: new Date(),
      pdfUrl
    };

    billing.invoices.push(invoice);
    await billing.save();

    console.log('✅ Invoice added');

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Invoice added successfully',
      data: invoice
    });
  } catch (error) {
    console.error('❌ Add invoice error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to add invoice'
    });
  }
};