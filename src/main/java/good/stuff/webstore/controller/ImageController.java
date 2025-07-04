package good.stuff.webstore.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import good.stuff.webstore.service.ImageService;

@Controller
public class ImageController {

    private final ImageService imageService;

    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @PostMapping("/upload-image")
    public String uploadImage(@RequestParam("image") MultipartFile file, Model model) {
        try {
            String imageUrl = imageService.uploadToDataBase(file);
            model.addAttribute("imageUrl", imageUrl);
            return "redirect:/products";
        } catch (Exception e) {
            model.addAttribute("error", "Image upload failed: " + e.getMessage());
            return "error";
        }
    }
}
