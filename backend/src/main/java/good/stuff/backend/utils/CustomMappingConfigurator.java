package good.stuff.backend.utils;

import org.modelmapper.ModelMapper;

public interface CustomMappingConfigurator<S, D> {
    void configure(ModelMapper modelMapper);
}
