package good.stuff.webstore.controller;

import good.stuff.webstore.common.dto.ProductDTO;
import good.stuff.webstore.service.CategoryService;
import good.stuff.webstore.service.ImageService;
import good.stuff.webstore.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Controller
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;
    private final CategoryService categoryService;
    private final ImageService imageService;

    @Autowired
    public ProductController(ProductService productService,
                             CategoryService categoryService,
                             ImageService imageService) {
        this.productService = productService;
        this.categoryService = categoryService;
        this.imageService = imageService;
    }

    // PUBLIC
    @GetMapping
    public String showProducts(Model model) {
        model.addAttribute("categories", categoryService.getAllCategories());
        return "store/products";
    }

    // ADMIN
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String showAdminProductPage(Model model) {
        model.addAttribute("products", productService.getAllProducts());
        model.addAttribute("categories", categoryService.getAllCategories());
        return "admin/admin-products";
    }

    @PostMapping("/admin/add")
    @PreAuthorize("hasRole('ADMIN')")
    public String addProduct(@ModelAttribute ProductDTO productDTO,
                             @RequestParam("categoryId") Long categoryId,
                             @RequestParam("image") MultipartFile imageFile) {

        productDTO.setId(null);
        productDTO.setCategoryId(categoryId);

        if (!imageFile.isEmpty()) {
            try {
                String imageUrl = imageService.uploadToDataBaseLocal(imageFile);
                productDTO.setImageUrl(imageUrl);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload image", e);
            }
        }

        productService.createProduct(productDTO);
        return "redirect:/products/admin";
    }

    @PostMapping("/admin/edit")
    @PreAuthorize("hasRole('ADMIN')")
    public String updateProduct(@ModelAttribute ProductDTO productDTO,
                                @RequestParam("categoryId") Long categoryId,
                                @RequestParam(value = "image", required = false) MultipartFile imageFile) {

        productDTO.setCategoryId(categoryId);

        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                String imageUrl = imageService.uploadToDataBaseLocal(imageFile);
                productDTO.setImageUrl(imageUrl);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload image", e);
            }
        }

        productService.updateProduct(productDTO.getId(), productDTO);
        return "redirect:/products/admin";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/edit/{id}")
    public String editProductForm(@PathVariable Long id, Model model) {
        model.addAttribute("product", productService.getProductById(id).orElse(new ProductDTO()));
        model.addAttribute("categories", categoryService.getAllCategories());
        return "admin/product-form";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/delete/{id}")
    public String deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return "redirect:/products/admin";
    }
}
