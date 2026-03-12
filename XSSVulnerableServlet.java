package com.example;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.lang3.StringEscapeUtils;

public class XSSVulnerableServlet extends HttpServlet {
    
    private static final long serialVersionUID = 1L;

    

    public XSSVulnerableServlet() {
        super();
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    } 

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }

    
    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();

        // Fetch the 'name' parameter from the HTTP request
        String userInput = request.getParameter("name");

        try {
            // Display the user input with proper HTML escaping to prevent XSS attacks
            out.println("<html>");
            out.println("<head><title>XSS Vulnerable Example</title></head>");
            out.println("<body>");
            out.println("<h1>Welcome to the XSS Vulnerable Page</h1>");
            out.println("<p>Hello, " + StringEscapeUtils.escapeHtml4(userInput) + "!</p>"); // XSS vulnerability fixed with HTML entity encoding
            out.println("</body>");
            out.println("</html>");
        } finally {
            out.close(); 
        }
    }
}
