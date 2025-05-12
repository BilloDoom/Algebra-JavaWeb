package good.stuff.webstore.controller.images;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.ui.Model;

import good.stuff.webstore.service.ImageService;

@Controller
public class CloudImageController {
    private final ImageService imageService;

    public CloudImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @PostMapping("/upload-image")
    public String uploadImage(@RequestParam("image") MultipartFile file, Model model) {
        try {
            String imageUrl = imageService.uploadToSupabase(file);
            model.addAttribute("imageUrl", imageUrl);
            return "redirect:/products";
        } catch (Exception e) {
            model.addAttribute("error", "Image upload failed: " + e.getMessage());
            return "error";
        }
    }
}
