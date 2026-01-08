const { query } = require('../db');

// Create e-ticket
const createETicket = async (req, res) => {
  console.log('Received e-ticket creation request:', req.body);
  try {
    const { 
      ticket_id, 
      property_id, 
      guest_name, 
      check_in_date, 
      check_out_date, 
      paid_amount, 
      due_amount 
    } = req.body;

    if (!ticket_id || !property_id || !guest_name || !check_in_date || !check_out_date) {
      console.log('Missing fields:', { ticket_id, property_id, guest_name, check_in_date, check_out_date });
      return res.status(400).json({
        success: false,
        message: 'Missing required fields for e-ticket.'
      });
    }

    console.log('Executing INSERT query for ticket:', ticket_id);
    const result = await query(
      `INSERT INTO etickets (
        ticket_id, property_id, guest_name, check_in_date, check_out_date, paid_amount, due_amount
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [ticket_id, property_id, guest_name, check_in_date, check_out_date, paid_amount, due_amount]
    );
    console.log('INSERT query successful:', result.rows[0]?.id);

    // Fetch property name for WhatsApp message
    console.log('Fetching property name for ID:', property_id);
    const propResult = await query('SELECT title FROM properties WHERE id = $1', [property_id]);
    const propertyName = propResult.rows[0]?.title || 'Property';
    console.log('Property name fetched:', propertyName);

    // Simulate sending SMS/Text Message for testing
    console.log(`\n--- SMS SENT TO 8669505727 ---`);
    console.log(`LoonCamp E-Ticket for ${guest_name}: ${process.env.FRONTEND_URL || 'http://localhost:5000'}/ticket/${ticket_id}`);
    console.log(`------------------------------\n`);

    return res.status(201).json({
      success: true,
      message: 'E-ticket created successfully.',
      data: {
        ...result.rows[0],
        property_name: propertyName
      }
    });
  } catch (error) {
    console.error('Create e-ticket error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create e-ticket.'
    });
  }
};

// Get e-ticket by ID
const getETicketById = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const result = await query(
      `SELECT e.*, p.title as property_name, p.map_link 
       FROM etickets e 
       JOIN properties p ON e.property_id = p.id 
       WHERE e.ticket_id = $1`,
      [ticketId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'E-ticket not found.'
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get e-ticket error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch e-ticket.'
    });
  }
};

module.exports = {
  createETicket,
  getETicketById
};
